import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./loginsignup.css";
import { FaLock, FaUnlock, FaUser } from "react-icons/fa";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    axios
      .post("http://localhost:3001/register", { username, password })
      .then((result) => {
        console.log(result);
        if (result.data.message === "Registered successfully") {
          // Registration successful
          toast.success("Registered successfully!", {
            position: "top-center",
            autoClose: 2000, // Show success message for 2 seconds
          });
  
          // Redirect to login page after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          // Server returned an error, show the error message
          toast.error(result.data.message, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("User already exists with the username.", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };
  

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="temp">
        <center>
      <div className="hello p-3 rounded-20 w-25">
        <center>
          <div className="user-circle">
            <FaUser style={{ fontSize: "54px" }} />
          </div>
          <h2>Register</h2>
        </center>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Enter username"
                autoComplete="off"
                name="username"
                className="form-control rounded-0"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text" onClick={togglePasswordVisibility}>
                {showPassword ? <FaUnlock /> : <FaLock />}
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                autoComplete="off"
                className="form-control rounded-0"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3">
            <label htmlFor="confirmPassword">
              <strong>Confirm Password</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text" onClick={togglePasswordVisibility}>
                {showPassword ? <FaUnlock /> : <FaLock />}
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                autoComplete="off"
                className="form-control rounded-0"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <center>
          <button type="submit" className="btn btn-success w-50 link-custom-bg">
            Register
          </button>
          </center>
        </form>
        <p>Already have an account?</p>
        <center>
        <Link
          to="/login"
          className="btn btn-default border w-50 link-custom-bg text-decoration-none"
          style={{ marginTop: "4px" }}
        >
          Login
        </Link>
        </center>
      </div>
      <ToastContainer />
      </center>
      </div>
    </div>
  );
}

export default Signup;
