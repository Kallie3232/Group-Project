////////////////////////////////////////////
//Equal to Client Users in Employee Dashboard
////////////////////////////////////////////

// import React, { useState, useEffect } from "react";

// const ClientList = () => {
//   const [clients, setClients] = useState([]);

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/users?role=client");
//         const data = await response.json();
//         setClients(data);
//       } catch (error) {
//         console.error("Error fetching clients:", error);
//       }
//     };

//     fetchClients();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-3xl font-bold mb-4">Client Users</h2>
//       <ul className="list-disc pl-4">
//         {clients.map((client) => (
//           <li key={client._id} className="mb-2">
//             {client.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ClientList;
