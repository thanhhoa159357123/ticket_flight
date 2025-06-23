import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { allRoutes } from "./routes";
import Dashboard from "./pages/home/Home";

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
