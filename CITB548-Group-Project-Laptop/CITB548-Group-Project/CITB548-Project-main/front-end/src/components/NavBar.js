import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import {
  FiMessageSquare,
  FiFolder,
  FiShoppingCart,
  FiCheckSquare,
} from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import HomeClient from "./Client/HomeClient";

const NavBar = ({ userRole, selectedComponent, onMenuItemClick }) => {
  const getMenuItems = () => {
    if (userRole === "client") {
      return [
        { name: "Home", link: "/", icon: MdOutlineDashboard },
        { name: "Account", link: "/", icon: AiOutlineUser },
        // { name: "messages", link: "/", icon: FiMessageSquare },
        {
          name: "Тrack Shipment",
          link: "/",
          icon: TbReportAnalytics,
          margin: true,
        },
        // { name: "File Manager", link: "/", icon: FiFolder },
        { name: "Your Shipments", link: "/", icon: FiShoppingCart },
        { name: "Send", link: "/", icon: TbTruckDelivery },
        // { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
        // { name: "Setting", link: "/", icon: RiSettings4Line },
      ];
    } else if (userRole === "employee") {
      return [
        {
          name: "Employee Dashboard",
          link: "/",
          icon: MdOutlineDashboard,
        },
        {
          name: "Task",
          link: "",
          icon: FiCheckSquare,
        },
        {
          name: "Company Office",
          link: "",
          icon: TbReportAnalytics,
        },
        {
          name: "Employee Queries",
          link: "/employee/settings",
          margin: true,

          icon: RiSettings4Line,
        },
        {
          name: "Account Settings",
          link: "/",
          icon: AiOutlineUser,
        },
        {
          name: "Register or Send",
          link: "/",
          icon: AiOutlineUser,
        },
      ];
    }
    // Default menu items if the user role is not recognized
    return [];
  };

  const [open, setOpen] = useState(true);
  const menuItems = getMenuItems();

  return (
    <section className="flex gap-6">
      <div
        className={`bg-[#1f2937] min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menuItems?.map((menu, i) => (
            <div
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
              onClick={() => onMenuItemClick(menu?.name)}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
      <div className="m-3 text-xl text-gray-900 font-semibold">
        {selectedComponent ? selectedComponent : <HomeClient />}
        {/* client* */}
 
      </div>
    </section>
  );
};

export default NavBar;
