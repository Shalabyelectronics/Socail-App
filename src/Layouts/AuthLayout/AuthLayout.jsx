import React from "react";
import authimg from "../../assets/auth/img1.jpg";
import { Outlet } from "react-router";
export default function AuthLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Image Section - No gaps on edges */}
      <div className="w-full md:w-1/2 lg:w-2/5">
        <img
          src={authimg}
          alt="authentication image"
          className="w-full h-64 md:h-screen object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center px-6 py-8 md:px-12 lg:px-20">
        <div className="w-full max-w-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
