import React, { useState, useEffect } from "react";
import axios from "axios";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // Assuming you have the user's ID available
        const userId = "user_id_here"; // Replace "user_id_here" with the actual user ID
        
        // Make a GET request to retrieve the user's email
        const response = await axios.get("http://localhost:3001/userEmail", {
          params: {
            userId: userId,
          },
        });
    
        // Extract the user's email from the response data
        const { email } = response.data;
        setUserEmail(email); // Set the userEmail state with the retrieved email
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (userEmail) {
          // Fetch orders using the user's email
          const response = await axios.get(`http://localhost:3001/shipmentsByUserEmail?email=${userEmail}`);
          setOrders(response.data); // Update state with fetched orders
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };
  
    fetchOrders();
  }, [userEmail]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Your Orders</h1>
      {orders.length > 0 ? (
        <ul className="list-disc list-inside">
          {orders.map((order) => (
            <li
              key={order._id}
              className="text-gray-800 mb-4 bg-gray-100 p-4 rounded-md shadow-md"
            >
              <p className="mb-2">
                <span className="font-semibold">Sender:</span>{" "}
                {order.senderName}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Receiver:</span>{" "}
                {order.receiverEmail}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Description:</span>{" "}
                {order.packageDescription}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-800">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrders;
