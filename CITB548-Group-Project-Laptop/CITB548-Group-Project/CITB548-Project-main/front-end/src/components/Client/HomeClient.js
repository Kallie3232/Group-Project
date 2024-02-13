import React from "react";
import backgroundImg from "../../img/backgroundImg.avif";
import "../css/HomeClient.css";

const HomeClient = () => {
  return (
    <div
      className="bg-cover text-white min-h-screen flex flex-col justify-center items-center div-image"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="text-6xl font-bold mb-4">
        Welcome to Our Logistics Company
      </div>
      <p className="text-lg text-center mb-8">
      Welcome to Our Logistics Company
      </p>
    </div>
  );
};

export default HomeClient;
