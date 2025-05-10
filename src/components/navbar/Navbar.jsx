import React from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="left_content">Travelocka</div>

      {/* RIGHT */}
      <div className="right_content">
        <span>Chuyến bay</span>
        <button className="login">Đăng nhập</button>
        <button className="register">Đăng kí</button>
      </div>
    </div>
  );
};

export default Navbar;
