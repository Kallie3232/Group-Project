import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendPack = () => {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [weight, setWeight] = useState(""); // State for weight

  const handleSendPackage = async () => {
    try {
      await axios.post("http://localhost:3001/sendPackage", {
        senderName,
        senderEmail,
        receiverEmail,
        packageDescription,
        status: "Pending", // Non-editable status field
        weight, // Weight field
      });
      toast.success("Package sent successfully!");
      setSenderName("");
      setSenderEmail("");
      setReceiverEmail("");
      setPackageDescription("");
      setWeight(""); // Reset weight after sending package
    } catch (error) {
      console.error("Error sending package:", error);
      toast.error("Error sending package");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">SendPack.js</h1>
      <form className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Sender Name:
        </label>
        <input
          type="text"
          className="mt-1 p-2 w-full border rounded-md"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Sender Email:
        </label>
        <input
          type="text"
          className="mt-1 p-2 w-full border rounded-md"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Receiver Email:
        </label>
        <input
          type="text"
          className="mt-1 p-2 w-full border rounded-md"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Package Description:
        </label>
        <textarea
          className="mt-1 p-2 w-full border rounded-md"
          value={packageDescription}
          onChange={(e) => setPackageDescription(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Weight (kg):
        </label>
        <input
          type="number"
          className="mt-1 p-2 w-full border rounded-md"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.01"
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Status:
        </label>
        <input
          type="text"
          value="Pending"
          readOnly
          className="mt-1 p-2 w-full border rounded-md bg-gray-100"
        />

        <button
          type="button"
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={handleSendPackage}
        >
          Send Package
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SendPack;
