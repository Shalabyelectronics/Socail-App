// 3. Updated Sidebar.jsx to use react-router-dom NavLink instead of state
import React from "react";
import { Card, CardBody } from "@heroui/react";
import { KeyRound, Camera } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const getNavLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? "bg-[#5E17EB]/10 text-[#5E17EB]"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#5E17EB]"
    }`;

  return (
    <Card className="w-full md:w-[280px] shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl h-fit flex-shrink-0 ">
      <CardBody className="p-3 flex flex-col gap-1">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3 pt-2">
          Profile Settings
        </h3>

        {/* Use NavLink to automatically handle active states based on the URL */}
        <NavLink to="/setting/update-profile-image" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <Camera size={20} className={isActive ? "text-[#5E17EB]" : ""} />
              <span>Update Profile Image</span>
            </>
          )}
        </NavLink>

        <NavLink to="/setting/change-password" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <KeyRound
                size={20}
                className={isActive ? "text-[#5E17EB]" : ""}
              />
              <span>Change Password</span>
            </>
          )}
        </NavLink>
      </CardBody>
    </Card>
  );
}
