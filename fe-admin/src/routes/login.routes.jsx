import React from "react";
import Login from "../pages/Account/Login";
import { Route } from "react-router-dom";



const loginRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
];

export default loginRoutes;