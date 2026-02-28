// Sidebar.jsx
import React from "react";
import { Card, CardBody } from "@heroui/react";
import { KeyRound, Camera } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const getNavLinkClass = ({ isActive }) =>
    `w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? "bg-[#5E17EB]/10 text-[#5E17EB]"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#5E17EB]"
    }`;

  return (
    <Card className="w-fit md:w-[280px] shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl h-fit flex-shrink-0">
      <CardBody className="p-2 md:p-3 flex flex-col gap-2 md:gap-1">
        <h3 className="hidden md:block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3 pt-2">
          Profile Settings
        </h3>

        <NavLink to="/setting/update-profile-image" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <Camera size={24} className={isActive ? "text-[#5E17EB]" : ""} />
              <span className="hidden md:inline">Update Profile Image</span>
            </>
          )}
        </NavLink>

        <NavLink to="/setting/change-password" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <KeyRound size={24} className={isActive ? "text-[#5E17EB]" : ""} />
              <span className="hidden md:inline">Change Password</span>
            </>
          )}
        </NavLink>
      </CardBody>
    </Card>
  );
}