import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterorSend = () => {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [shipmentWeight, setShipmentWeight] = useState("");
  const [shipments, setShipments] = useState([]);
  const [editingShipmentId, setEditingShipmentId] = useState(null);
  const [editedPackageDescription, setEditedPackageDescription] = useState("");
  const [editedSenderEmail, setEditedSenderEmail] = useState("");
  const [editedReceiverEmail, setEditedReceiverEmail] = useState("");
  const [editedWeight, setEditedWeight] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/shipments");
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  const handleEdit = (shipmentId, shipmentData) => {
    setEditingShipmentId(shipmentId);
    setEditedSenderEmail(shipmentData.senderEmail);
    setEditedReceiverEmail(shipmentData.receiverEmail);
    setEditedPackageDescription(shipmentData.packageDescription);
    setEditedWeight(shipmentData.weight);
    setEditedStatus(shipmentData.status);
  };

  const handleCancelEdit = () => {
    setEditingShipmentId(null);
    setEditedSenderEmail("");
    setEditedReceiverEmail("");
    setEditedPackageDescription("");
    setEditedWeight("");
    setEditedStatus("");
  };

  const handleSaveEdit = async (shipmentId) => {
    try {
      const response = await axios.put(`http://localhost:3001/shipments/${shipmentId}/updateShipment`, {
        senderEmail: editedSenderEmail,
        receiverEmail: editedReceiverEmail,
        packageDescription: editedPackageDescription,
        weight: editedWeight,
        status: editedStatus
      });
  
      // Assuming the response contains the updated shipment data
      const updatedShipment = response.data;
  
      // Update the shipments state with the updated shipment
      const updatedShipments = shipments.map(shipment => {
        if (shipment._id === shipmentId) {
          return updatedShipment;
        }
        return shipment;
      });
  
      // Set the updated shipments state and clear editing state
      setShipments(updatedShipments);
      setEditingShipmentId(null);
      toast.success("Shipment updated successfully");
  
      // Fetch the updated shipments immediately after saving the edit
      fetchShipments();
    } catch (error) {
      console.error("Error updating shipment:", error);
      toast.error("Error updating shipment");
    }
  };

  const handleDelete = async (shipmentId) => {
    try {
      await axios.delete(`http://localhost:3001/shipments/${shipmentId}`);
      toast.success("Shipment deleted successfully");
      fetchShipments();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Error deleting shipment");
    }
  };

  const calculatePrice = (weight) => {
    const price = parseFloat(weight) > 20 ? 10 + parseFloat(weight) : 5 + parseFloat(weight);
    return `$${price.toFixed(2)}`;
  };

  const handleSendPackage = async () => {
    if (!senderName || !senderEmail || !receiverEmail || !packageDescription || !shipmentWeight) {
      toast.error("Please fill in all fields before sending the package");
      return;
    }
  
    try {
      await axios.post("http://localhost:3001/sendPackage", {
        senderName,
        senderEmail,
        receiverEmail,
        packageDescription,
        weight: shipmentWeight,
        status: "Pending"
      });
  
      toast.success("Package sent successfully!");
  
      fetchShipments(); 
      
      setSenderName("");
      setSenderEmail("");
      setReceiverEmail("");
      setPackageDescription("");
      setShipmentWeight("");
    } catch (error) {
      console.error("Error sending package:", error);
      toast.error("Error sending package");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Package</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Sender Name:</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Sender Email:</label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Receiver Email:</label>
              <input
                type="text"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Package Description:</label>
              <textarea
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Shipment Weight (kg):</label>
              <input
                type="number"
                value={shipmentWeight}
                onChange={(e) => setShipmentWeight(e.target.value)}
                step="0.01"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Status:</label>
              <input
                type="text"
                value="Pending"
                readOnly
                className="w-full p-2 border rounded-md"
              />
            </div>

            <button
              type="button"
              onClick={handleSendPackage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send Package
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">All Shipments</h2>
          <ul className="divide-y divide-gray-300">
            {shipments.map((shipment) => (
              <li key={shipment._id} className="py-2">
                <div>
                  {editingShipmentId === shipment._id ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Sender:</label>
                        <input
                          type="text"
                          value={editedSenderEmail}
                          onChange={(e) => setEditedSenderEmail(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Receiver:</label>
                        <input
                          type="text"
                          value={editedReceiverEmail}
                          onChange={(e) => setEditedReceiverEmail(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Description:</label>
                        <textarea
                          value={editedPackageDescription}
                          onChange={(e) => setEditedPackageDescription(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Weight (kg):</label>
                        <input
                          type="number"
                          value={editedWeight}
                          onChange={(e) => setEditedWeight(e.target.value)}
                          step="0.01"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Status:</label>
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Sent">Sent</option>
                          <option value="Arrived">Arrived</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(shipment._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Sender:</span> {shipment.senderEmail}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Receiver:</span> {shipment.receiverEmail}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Description:</span>{" "}
                        {shipment.packageDescription}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Weight:</span> {shipment.weight} kg
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Status:</span> {shipment.status}
                      </p>
                      {/* Calculate and display price */}
                  <p className="text-sm">
                    <span className="font-semibold">Price:</span> {calculatePrice(shipment.weight)}
                  </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(shipment._id, shipment)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(shipment._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterorSend;
