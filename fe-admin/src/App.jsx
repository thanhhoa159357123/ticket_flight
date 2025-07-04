import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { allRoutes } from "./routes";
import Khach_Hang from "./pages/khachhang/Khach_Hang";
import Dashboard from "./pages/home/Home"; // nếu vẫn giữ trang chào mừng admin
import Hang_Bay from "./pages/hangbay/Hang_Bay";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {allRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {/* Thêm route khác tại đây */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
