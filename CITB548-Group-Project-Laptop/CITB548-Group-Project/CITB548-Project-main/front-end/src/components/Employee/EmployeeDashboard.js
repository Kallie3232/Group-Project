import React, { useState, useEffect } from "react";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/users?role=employee");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3001/users?role=client");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="flex justify-between p-8">
      {/* Employee Users Section */}
      <div className="w-1/2">
        <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
        <ul className="list-disc pl-4">
          {employees.map((employee) => (
            <li key={employee._id} className="mb-2">
              {employee.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Client Users Section */}
      <div className="w-1/2">
        <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>
        <ul className="list-disc pl-4">
          {clients.map((client) => (
            <li key={client._id} className="mb-2">
              {client.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
