// src/components/Auth.js
import React from "react";
import { Navigate } from "react-router-dom";

const Auth = ({ children }) => {
  const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage sau khi đăng nhập

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Auth;
