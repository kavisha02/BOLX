import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import API_URL from "../constants";
import io from "socket.io-client";
//import "./productDetail.css"; // Import the CSS file
let socket;

function ProductDetail() {
  const [product, setProduct] = useState();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [user, setUser] = useState();
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
  }, []);

  const handleContact = (addedBy) => {
    axios
      .get(`${API_URL}/get-user/${addedBy}`)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => alert("Server Error"));
  };

  return (
    <>
      <Header />
      <div className="product-detail-container">
        {product && (
          <>
            <div className="product-images">
              <img
                width="400px"
                height="200px"
                src={`${API_URL}/${product.pimage}`}
                alt="Product"
              />
              {product.pimage2 && (
                <img
                  width="400px"
                  height="200px"
                  src={`${API_URL}/${product.pimage2}`}
                  alt="Product Secondary"
                />
              )}
            </div>
            <div className="product-info">
              <h6>Product Details:</h6>
              <p>{product.pdesc}</p>
              <h3>Rs. {product.price} /-</h3>
              <p>
                {product.pname} | {product.category}
              </p>
              {product.addedBy && (
                <button
                  onClick={() => handleContact(product.addedBy)}
                  className="contact-button"
                >
                  SHOW CONTACT DETAILS
                </button>
              )}
              {user && (
                <div>
                  <h5>Name: {user.username}</h5>
                  <h5>Mob Number: {user.mobile}</h5>
                  <h5>Email: {user.email}</h5>
                </div>
              )}
            </div>
            <div className="chat-section">
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
                  className="form-control"
                  type="text"
                  placeholder="Type your message"
                />
                <button onClick={handleSend} className="btn btn-primary">
                  SEND
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
