import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-800 p-4 sticky">
      <div className="container mx-auto flex justify-between items-center">
        <a className="text-white text-xl font-bold">Welcome: {user}</a>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-white">
                {/* <p className="font-semibold">{`${user}`}</p> */}
                <p>{`Role: ${role}`}</p>
              </div>
              <button className="text-white" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-white">
              Exit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
