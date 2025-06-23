import React from "react";
import PlaneImg from "../assets/bg_feature.jpg";

const Feature = () => {
  return (
    <section className="flex justify-center items-center relative min-h-[60vh] px-[60px] py-[20px] overflow-hidden bg-[linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);]">
      <div className="w-[100%] max-w-[1200px] flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#2c3e50] mb-[20px] tracking-tight">
          <span className="bg-gradient-to-r from-[#3498db] to-[#2ecc71] bg-clip-text text-transparent">
            Create Ever-lasting
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#3498db] to-[#2ecc71] bg-clip-text text-transparent">
            Memories With Us
          </span>
        </h1>

        <p className="text-[1.25rem] text-[#7f8c8d] mb-[40px] max-w-[600px]">
          Discover the world with our premium flight experiences
        </p>

        <div
          className="
    w-full max-w-[800px] h-[300px] mb-[30px] 
    rounded-[20px] overflow-hidden relative 
    shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] 
  "
        >
          <img
            src={PlaneImg}
            alt="Airplane in flight"
            className="w-full h-full object-cover object-center transition-transform duration-500"
          />
          <div
            className="
      absolute top-0 left-0 w-full h-full 
      bg-gradient-to-t from-[rgba(0,0,0,0.3)] via-transparent
    "
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
