import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Feature from "../../components/feature/Feature";
import Booking from "../../components/booking/Booking";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Feature />
      <Booking />
      <Footer />
    </div>
  );
};

export default Home;
