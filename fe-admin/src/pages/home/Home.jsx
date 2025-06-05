import React from 'react';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Admin!</h1>
        <p className="text-gray-500 mb-6">Here's what's happening with your system today.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800">Total Bookings</h3>
            <p className="text-2xl font-bold mt-2">1,248</p>
          </div>
          {/* Thêm card khác nếu cần */}
        </div>
      </div>
    </div>
  );
};

export default Home;
