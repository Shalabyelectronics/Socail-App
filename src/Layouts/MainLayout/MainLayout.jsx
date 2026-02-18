import React from "react";
import { Outlet } from "react-router";
import NavbarUI from "./../../components/NavbarUI/NavbarUI";
import Footer from "./../../components/Footer/Footer";

export default function MainLayout() {
  return (
    <>
      <NavbarUI />
      <Outlet />
      <Footer />
    </>
  );
}
