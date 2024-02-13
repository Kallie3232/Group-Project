import React, { useState, useEffect } from "react";
import axios from "axios";

const ShipmentsList = ({ userEmail }) => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchUserShipments = async () => {
      try {
        // Fetch the current user's shipments using their email
        const response = await axios.get(`/userShipments?userEmail=${userEmail}`);
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching user shipments:", error);
      }
    };

    fetchUserShipments();
  }, [userEmail]);

  return (
    <div>
      <h2>Shipments for {userEmail}</h2>
      <ul>
        {shipments.map((shipment) => (
          <li key={shipment._id}>
            <strong>Sender Email:</strong> {shipment.senderEmail}
            <br />
            <strong>Receiver Email:</strong> {shipment.receiverEmail}
            <br />
            <strong>Package Description:</strong> {shipment.packageDescription}
            <br />
            {/* Add more shipment details as needed */}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentsList;
