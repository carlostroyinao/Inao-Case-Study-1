import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Predefined users
    const users = {
      admin: { password: "thacky", redirect: "/home" },
      captain: { password: "thacky", redirect: "/captain_home" },
    };

    if (users[email] && users[email].password === password) {
      toast.success(`Welcome, ${email}! Login successful!`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect based on user role
      setTimeout(() => navigate(users[email].redirect), 1000);
    } else {
      toast.error("Invalid email or password", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="format">
      <div className="shape"></div>
      <div className="shape"></div>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          className="inputForm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="inputForm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="buttonForm">Log In</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
