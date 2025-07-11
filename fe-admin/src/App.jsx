import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { allRoutes } from "./routes";
import Dashboard from "./pages/home/Home"; 
import loginRoutes from "./routes/login.routes";
import Auth from "./components/Auth"; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Render login routes (không cần đăng nhập) */}
        {loginRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}

        {/* Các route còn lại cần đăng nhập */}
        <Route
          path="/"
          element={
            <Auth>
              <Layout />
            </Auth>
          }
        >
          <Route index element={<Dashboard />} />
          {allRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
