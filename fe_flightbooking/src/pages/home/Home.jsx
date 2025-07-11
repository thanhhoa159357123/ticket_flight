import React from "react";
import Navbar from "../../components/Navbar";
import Feature from "../../components/Feature";
import Booking from "../../components/Booking";
import Footer from "../../components/Footer";
const Home = () => {
  

  return (
    <div>
      <Navbar />
      <Feature />
      <div className="bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e8eb_100%)]">
        <Booking />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
