import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [userName, setUserName] = useState(""); // Ново поле за въвеждане на userName

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/signup", {
        email,
        password,
        role,
        userName, // Включване на userName в заявката
      });

      if (res.data === "exist") {
        toast.error("User already exists");
      } else if (res.data === "notexist") {
        history("/home", { state: { id: email } });
      }
    } catch (error) {
      toast.error("Error during registration");
      console.error(error);
    }
  }

  return (
    <div className="login bg-gray-100 min-h-screen flex items-center justify-center">
      <ToastContainer />

      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

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
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)} // Ново поле за въвеждане на userName
            placeholder="User Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <label>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="client">Client</option>
              <option value="employee">Employee</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Signup
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center">OR</p>
        </div>

        <div className="mt-4">
          <Link
            to="/"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-center justify-center flex"
          >
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
