import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3001/", {
        email,
        password,
      });
  
      const { token, error } = response.data;
  
      if (token) {
        // Redirect to the home page with user's email as state
        history("/home", { state: { id: email } });
      } else {
        // Display error message if login fails
        toast.error(error);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Login error:", error);
      toast.error("An error occurred while logging in");
    }
  }
  

  return (
    <div className="login bg-gray-100 min-h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={submit}>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center">OR</p>
        </div>

        <div className="mt-4">
          <Link
            to="/signup"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-center justify-center flex"
          >
            Signup Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
