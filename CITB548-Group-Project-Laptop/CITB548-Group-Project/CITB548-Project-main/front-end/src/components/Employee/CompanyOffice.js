////////////////////////////////////////////
//Equal to Company Office page
////////////////////////////////////////////

import React, { useState, useEffect } from "react";

const CompanyOffice = () => {
  const [officeInfo, setOfficeInfo] = useState({
    name: "",
    location: "",
  });
  
  const [addedOffice, setAddedOffice] = useState(null);
  const [allOffices, setAllOffices] = useState([]);
  const [error, setError] = useState(null);
  const [editingOfficeId, setEditingOfficeId] = useState(null); // State to track the currently editing office ID

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch("http://localhost:3001/offices");
        const offices = await response.json();
        setAllOffices(offices);
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    fetchOffices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfficeInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  // Client-Side Code - handleSubmit function adjustment
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!officeInfo.name || !officeInfo.location) {
    setError("Name and location are required fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/addOffice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: officeInfo.name, location: officeInfo.location }), // Ensure correct field names
    });

    if (response.ok) {
      const addedOfficeData = await response.json();
      setAddedOffice(addedOfficeData.office);
      console.log("Office added successfully");

      const updatedResponse = await fetch("http://localhost:3001/offices");
      const updatedOffices = await updatedResponse.json();
      setAllOffices(updatedOffices);
      setError(null);
    } else {
      console.error("Error adding office");
    }
  } catch (error) {
    console.error("Error adding office:", error);
  }
};


  const handleDelete = async (officeId) => {
    try {
      const response = await fetch(`http://localhost:3001/offices/${officeId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedOffices = allOffices.filter((office) => office._id !== officeId);
        setAllOffices(updatedOffices);
      } else {
        console.error("Failed to delete office");
      }
    } catch (error) {
      console.error("Error deleting office:", error);
    }
  };

  const handleEdit = async (officeId) => {
    setEditingOfficeId(officeId); // Set the office ID being edited
    // Fetch the office data to pre-fill the form fields
    const officeToEdit = allOffices.find((office) => office._id === officeId);
    if (officeToEdit) {
      setOfficeInfo({
        name: officeToEdit.name,
        location: officeToEdit.location,
      });
    }
  };

  const handleUpdate = async () => {
    // Update the office data
    try {
      const response = await fetch(`http://localhost:3001/offices/${editingOfficeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(officeInfo),
      });
      if (response.ok) {
        // Update the office in the list
        const updatedOffices = allOffices.map((office) => {
          if (office._id === editingOfficeId) {
            return { ...office, ...officeInfo };
          }
          return office;
        });
        setAllOffices(updatedOffices);
        setEditingOfficeId(null); // Clear the editing state
        setOfficeInfo({ name: "", location: "" }); // Clear the input fields
      } else {
        console.error("Failed to update office");
      }
    } catch (error) {
      console.error("Error updating office:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Office</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Office Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={officeInfo.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={officeInfo.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        {editingOfficeId ? (
          <button
            type="button"
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline-green active:bg-green-800"
          >
            Update Office
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Add Office
          </button>
        )}
      </form>

      {addedOffice && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Added Office:</h2>
          <p>
            Name: {addedOffice.name}, Location: {addedOffice.location}
          </p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Offices:</h2>
        <ul>
          {allOffices.map((office) => (
            <li key={office._id}>
              Name: {office.name}, Location: {office.location}
              <button
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleDelete(office._id)}
              >
                Delete
              </button>
              <button
                className="ml-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleEdit(office._id)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyOffice;
