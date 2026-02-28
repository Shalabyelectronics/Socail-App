import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div className="w-full flex flex-row gap-3 md:gap-8 items-start">
      <div className="flex-1 w-full flex justify-center">
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}