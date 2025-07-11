import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [tenKhachHang, setTenKhachHang] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.ten_khach_hang) {
      setTenKhachHang(userData.ten_khach_hang);
    }
  }, []);

  return (
    <nav className="bg-white flex sticky justify-between items-center px-[100px] shadow-md top-0 z-50 h-[90px]">
      {/* LEFT */}
      <div>
        <Link
          to="/"
          className="text-[28px] font-extrabold text-[#007bff] no-underline tracking-tighter hover:text-[#0056b3]"
        >
          Travelokaa
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-[25px] h-[100%]">
        <Link
          to="#"
          className="flex items-center h-[100%] text-[16px] font-semibold no-underline px-2 py-3 rounded-lg relative transition duration-300 ease hover:text-[#007bff] hover:after:w-[100%] after:content-[''] after:absolute after:bottom-[20px] after:left-0 after:w-0 after:h-[2px] after:bg-[#007bff] after:transition-width after:duration-300 after:ease"
        >
          Chuyến bay
        </Link>
        <span
          onClick={() =>
            navigate("/flight-ticket", { state: { showAll: true } })
          }
          className="flex items-center h-[100%] text-[16px] font-semibold no-underline px-2 py-3 rounded-lg cursor-pointer relative transition duration-300 ease hover:text-[#007bff] hover:after:w-[100%] after:content-[''] after:absolute after:bottom-[20px] after:left-0 after:w-0 after:h-[2px] after:bg-[#007bff] after:transition-width after:duration-300 after:ease"
        >
          Vé máy bay
        </span>

        {tenKhachHang ? (
          <div className="relative flex items-center h-full group">
            <div
              className="px-3 py-2 font-semibold cursor-pointer flex items-center rounded-md h-full text-black relative transition-all duration-200 ease-in-out 
              hover:text-[#007bff] after:content-[''] after:absolute after:bottom-[20px] after:left-0 after:h-[2px] after:w-0 
              after:bg-[#007bff] after:text-[#007bff] after:transition-all after:duration-200 group-hover:after:w-full"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] inline-block">
                {tenKhachHang}
              </span>
            </div>

            <div
              className="absolute top-[calc(100%-10px)] right-0 w-[200px] bg-white border border-[#e0e0e0] 
              rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] opacity-0 invisible translate-y-[-10px] 
              transition-all duration-300 ease-in-out z-[100] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
              before:content-[''] before:absolute before:bottom-full before:right-[15px] before:border-8 
              before:border-transparent before:border-b-white before:filter before:drop-shadow-[0_-2px_1px_rgba(0,0,0,0.05)] 
              after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-5 after:bg-transparent"
            >
              <Link
                to="/detail-account"
                className="block w-full px-4 py-3 text-left text-[#333] text-sm transition-all duration-300 ease-in-out hover:bg-[#f7f7f7] rounded-t-lg"
              >
                Thông tin cá nhân
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="block w-full px-4 py-3 text-left text-[#d32f2f] cursor-pointer text-sm border-t border-[#f0f0f0] transition-all duration-300 ease-in-out hover:bg-[#ffebee] rounded-b-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button
                className="relative inline-flex items-center justify-center
    w-[130px] h-[40px] px-6 text-[15px] font-semibold
    rounded-lg cursor-pointer overflow-hidden
    transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    group border border-black/15 bg-transparent text-black"
              >
                <span className="relative z-10 group-hover:text-white">
                  Đăng nhập
                </span>
                <span
                  className="absolute inset-0 z-0 rounded-md 
                  bg-gradient-to-br from-[#007bff] to-[#0065d1] 
                  transform scale-95 translate-y-full opacity-0 
                  transition-all duration-400 
                  group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100"
                ></span>
              </button>
            </Link>

            <Link to="/register">
              <button
                className="relative inline-flex items-center justify-center
    w-[130px] h-[40px] px-6 text-[15px] font-semibold
    rounded-lg cursor-pointer overflow-hidden
    transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    group text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
              >
                <span className="relative z-10 group-hover:text-black">
                  Đăng kí
                </span>
                <span
                  className="absolute inset-0 bg-white transform translate-y-[-100%] scale-90 opacity-0 
                  group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 
                  transition-all duration-400 rounded-[6px] z-0"
                ></span>
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
