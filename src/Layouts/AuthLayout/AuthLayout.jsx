import React from "react";
import authimg from "../../assets/auth/img1.jpg";
import { Outlet } from "react-router";
export default function AuthLayout() {
  return (
    <>
      <div className="container  h-screen ">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="w-full md:w-1/3">
            <img
              src={authimg}
              alt="authentication image"
              className="w-full h-96 md:min-h-screen object-cover"
            />
          </div>
          <div className="md:w-2/3 px-[2.5rem]">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
