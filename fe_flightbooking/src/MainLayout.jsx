// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // nếu có

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
