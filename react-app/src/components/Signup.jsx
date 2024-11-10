import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";


function Signup() {
  const navigate = useNavigate();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages


  const handleApi = () => {
    // Validate the email for BITS Pilani format
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@pilani\.bits-pilani\.ac\.in$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Only BITS Pilani email addresses are allowed.");
       // Exit the function if the email is invalid
      
        


        return;


    }
    
  

    const url = API_URL + "/signup";
    const data = { username, password, mobile, email };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          // Redirect to the home page after successful signup
          navigate('/login'); // This will navigate the user to the home page
        }
      })
      .catch((err) => {
        alert("SERVER ERR");
      });
  };


  return (
    <div>
      <Header />
      <div className="p-3 m-3">
        <h3>Welcome to Signup Page!</h3>
        <br />
        USERNAME
        <input
          className="form-control"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        MOBILE
        <input
          className="form-control"
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <br />
        EMAIL
        <input
          className="form-control"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        PASSWORD
        <input
          className="form-control"
          type="password" // Changed to password type for better security
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
        {/* Display error message */}
        <button className="btn-new" onClick={handleApi}> SIGNUP </button>
                <Link className="btn-link" to="/login">  LOGIN </Link>

      </div>
    </div>
  );
}


export default Signup;


