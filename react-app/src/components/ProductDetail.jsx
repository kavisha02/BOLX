import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import API_URL from "../constants";
import io from "socket.io-client";
import Slider from "react-slick"; // For image carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./productDetail.css"; // Import the updated CSS for the page
import { FaCommentAlt, FaPaperPlane } from "react-icons/fa"; // Import FontAwesome icons


let socket;


function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const p = useParams();


  useEffect(() => {
    socket = io(API_URL);
    socket.on("connect", () => console.log("Connected to socket"));
    return () => socket.off();
  }, []);


  useEffect(() => {
    socket.on("getMsg", (data) => {
      const filteredMsgs = data.filter((item) => item.productId == p.productId);
      setMsgs(filteredMsgs);
    });
  }, [p.productId]);


  const handleSend = () => {
    if (!msg.trim()) return;
    const data = {
      username: localStorage.getItem("userName"),
      msg,
      productId: localStorage.getItem("productId"),
    };
    socket.emit("sendMsg", data);
    setMsg("");
  };


  useEffect(() => {
    axios
      .get(`${API_URL}/get-product/${p.productId}`)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
          localStorage.setItem("productId", res.data.product._id);
        }
      })
      .catch(() => alert("Server Error"));
  }, [p.productId]);


  const handleContact = (addedBy) => {
    axios
      .get(`${API_URL}/get-user/${addedBy}`)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          console.log("User not found");
        }
      })
      .catch(() => alert("Server Error"));
  };


  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };


  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
    if (!isContactOpen && product && product.addedBy) {
      handleContact(product.addedBy);
    }
  };


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Remove the arrow buttons
  };


  return (
    <>
      <Header />
      <div className="product-detail-container">
        {product && (
          <div className="product-detail-content">
            <div className="product-image-section">
              <Slider {...sliderSettings}>
                <div>
                  <img
                    className="product-image"
                    src={`${API_URL}/${product.pimage}`}
                    alt="Product"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                {product.pimage2 && (
                  <div>
                    <img
                      className="product-image"
                      src={`${API_URL}/${product.pimage2}`}
                      alt="Product Secondary"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </Slider>
            </div>


            <div className="product-details-section">
              <h1 className="product-title">{product.pname}</h1>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.pdesc}</p>
              <h3 className="product-price">₹ {product.price} /-</h3>
              <button onClick={toggleContact} className="contact-btn">
                {isContactOpen
                  ? "Hide Contact Details"
                  : "Show Contact Details"}
              </button>


              {isContactOpen && user && (
                <div className="contact-details-modal">
                  <h5>Name: {user.username}</h5>
                  <h5>Mob Number: {user.mobile}</h5>
                  <h5>Email: {user.email}</h5>
                </div>
              )}
            </div>
          </div>
        )}


        <div className="chat-section">
          <button onClick={toggleChat} className="chat-button">
            <FaCommentAlt size={30} /> {/* Chat Icon */}
          </button>
        </div>


        {isChatOpen && (
          <div className="chat-container">
            <h6>CHATS</h6>
            {msgs.map((item, index) => (
              <p
                key={index}
                className={`chat-bubble ${
                  item.username === localStorage.getItem("userName")
                    ? "chat-bubble-user"
                    : "chat-bubble-other"
                }`}
              >
                {item.username}: {item.msg}
              </p>
            ))}
            <div className="chat-input">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="chat-input-field"
                type="text"
                placeholder="Type your message"
              />
              <button onClick={handleSend} className="send-btn">
                <FaPaperPlane size={20} /> {/* Send Icon */}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default ProductDetail;



