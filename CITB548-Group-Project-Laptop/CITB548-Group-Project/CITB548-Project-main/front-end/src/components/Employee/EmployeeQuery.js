import React, { useState } from "react";

const EmployeeQuery = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedShipments, setSearchedShipments] = useState([]);

  const fetchShipmentsByUserEmail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/shipmentsByUserEmail?email=${searchEmail}`);
      const data = await response.json();
      setSearchedShipments(data);
    } catch (error) {
      console.error("Error fetching shipments by user email:", error);
    }
  };

  return (
    <div>
      {/* Your Employee Query content goes here */}
      <h1>Employee Query</h1>
      {/* Search Shipments by Email Section */}
      <div className="w-full mt-8">
        <h2 className="text-3xl font-bold mb-4">Search Shipments by Email</h2>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded mr-2"
          />
          <button
            onClick={fetchShipmentsByUserEmail}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search Shipments
          </button>
        </div>

        {/* Display Searched Shipments */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">Searched Shipments</h2>
          {searchedShipments.length > 0 ? (
            <ul>
              {searchedShipments.map((shipment) => (
                <div key={shipment._id} className="mb-4">
                  <hr className="mb-2" />
                  <p><strong>Sender Email:</strong> {shipment.senderEmail}</p>
                  <p><strong>Receiver Email:</strong> {shipment.receiverEmail}</p>
                  <p><strong>Package Description:</strong> {shipment.packageDescription}</p>
                  <p><strong>Weight:</strong> {shipment.weight}</p>
                  <p><strong>Status:</strong> {shipment.status}</p>
                </div>
              ))}
            </ul>
          ) : (
            <p>No shipments found for the entered email.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeQuery;
