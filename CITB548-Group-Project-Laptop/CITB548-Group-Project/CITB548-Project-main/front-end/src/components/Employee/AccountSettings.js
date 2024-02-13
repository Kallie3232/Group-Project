////////////////////////////////////////////
//Account Settings on the website
////////////////////////////////////////////
import React, { useState } from "react";

const AccountSettings = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUpdateUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUserEmail,
          newEmail,
          newPassword,
          newUserName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Your data has been successfully updated!");
        console.log("User updated successfully:", data);
      } else {
        console.error("Error updating user:", data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await fetch(`http://localhost:3001/users/${currentUserEmail}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          console.log("Account deleted successfully");
          setSuccessMessage("Your account has been successfully deleted!");
          // Clear form fields after deletion
          setCurrentUserEmail("");
          setNewEmail("");
          setNewPassword("");
          setNewUserName("");
          // Redirect to login menu
          window.location.href = "/Signup";
        } else {
          const data = await response.json();
          console.error("Error deleting account:", data.error);
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      {successMessage && (
        <div className="notification success">{successMessage}</div>
      )}
      {showConfirmation && (
        <div className="notification warning">
          Are you sure you want to delete your account?
          <button onClick={handleDeleteAccount}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
        </div>
      )}
      <label htmlFor="currentEmail" className="block text-sm font-semibold">
        Current Email:
      </label>
      <input
        type="email"
        id="currentEmail"
        value={currentUserEmail}
        onChange={(e) => setCurrentUserEmail(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-md mb-4"
      />
      <label htmlFor="newEmail" className="block text-sm font-semibold">
        New Email:
      </label>
      <input
        type="email"
        id="newEmail"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-md mb-4"
      />
      <label htmlFor="newPassword" className="block text-sm font-semibold">
        New Password:
      </label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-md mb-4"
      />
      <label htmlFor="newUserName" className="block text-sm font-semibold">
        New User Name:
      </label>
      <input
        type="text"
        id="newUserName"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={handleUpdateUser}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Update User
      </button>
      <button
        onClick={() => setShowConfirmation(true)}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-4"
      >
        Delete Account
      </button>
    </div>
  );
};

export default AccountSettings;
