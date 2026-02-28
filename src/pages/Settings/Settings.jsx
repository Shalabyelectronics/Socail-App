import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start">
      <div className="flex-1 w-full flex justify-center">
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}