import React from "react";
import { Outlet } from "react-router";
import NavbarUI from "./../../components/NavbarUI/NavbarUI";
import FeedContextProvider from "../../components/FeedContext/FeedContextProvider";
import Footer from "./../../components/Footer/Footer";

export default function MainLayout() {
  return (
    <FeedContextProvider>
      <NavbarUI />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </FeedContextProvider>
  );
}
