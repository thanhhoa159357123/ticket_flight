import React from "react";
import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* 👈 trang cụ thể sẽ được render tại đây */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
