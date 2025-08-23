import React from "react";
const FacebookIcon = React.lazy(() => import("@mui/icons-material/Facebook"));
const InstagramIcon = React.lazy(() => import("@mui/icons-material/Instagram"));
const YouTubeIcon = React.lazy(() => import("@mui/icons-material/YouTube"));

const Footer = () => {
  const handleDownloadApp = () => {
    return alert("App sẽ hoàn thiện trong thời gian sớm nhất");
  };

  return (
    <div className="bg-[#f5f6fa] flex px-[40px] border-t-[1px] border-solid border-[#e5e5e5] justify-center items-center">
      <div className="w-full max-w-[1400px] m-0-auto py-[20px]">
        <div className="grid grid-cols-5 gap-[2rem] pb-20px border-b-[1px] border-solid border-[#e0e0e0]">
          <div className="text-[18px] font-bold text-[#017EBE] pb-[10px]">
            Về Travelocka
          </div>
          <div className="text-[18px] font-bold text-[#017EBE] pb-[10px]">
            Sản phẩm
          </div>
          <div className="text-[18px] font-bold text-[#017EBE] pb-[10px]">
            Khác
          </div>
          <div className="text-[18px] font-bold text-[#017EBE] pb-[10px]">
            Theo dõi chúng tôi
          </div>
          <div className="text-[18px] font-bold text-[#017EBE] pb-[10px]">
            Tải ứng dụng Travelocka
          </div>
        </div>
        <div className="grid grid-cols-5 gap-[2rem] pt-[30px]">
          <div className="text-[16px] font-medium text-[#4A8DFF] mb-[12px] relative cursor-pointer transition-all duration-300 ease w-fit h-fit hover:text-[#4A8DFF] hover:after:w-[100%] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#4A8DFF] after:transition-width after:duration-300 ease ">
            Cách đặt chỗ
          </div>
          <div className="text-[16px] font-medium text-[#4A8DFF] mb-[12px] relative cursor-pointer transition-all duration-300 ease w-fit h-fit hover:text-[#4A8DFF] hover:after:w-[100%] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#4A8DFF] after:transition-width after:duration-300 ease ">
            Vé máy bay
          </div>
          <div className="text-[16px] font-medium text-[#4A8DFF] mb-[12px] relative cursor-pointer transition-all duration-300 ease w-fit h-fit hover:text-[#4A8DFF] hover:after:w-[100%] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#4A8DFF] after:transition-width after:duration-300 ease ">
            Quy chế hoạt động
          </div>
          <div className="inline-flex flex-col gap-[15px] relative">
            {/* Facebook */}
            <div
              className="relative inline-flex font-medium items-center gap-[10px] cursor-pointer text-[16px] text-[#4A8DFF] px-[5px] w-fit h-fit transition-all duration-200 ease-in-out
      hover:text-black group"
            >
              <FacebookIcon className="text-[22px] text-[#4A8DFF] transition-all duration-200 ease-in-out group-hover:text-[#3b5998]" />
              <span>Facebook</span>
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-[#3b5998] transition-all duration-300 ease-in-out
        group-hover:w-full"
              />
            </div>

            {/* Instagram */}
            <div
              className="relative inline-flex font-medium items-center gap-[10px] cursor-pointer text-[16px] text-[#4A8DFF] px-[5px] w-fit h-fit transition-all duration-200 ease-in-out
      hover:text-black group"
            >
              <InstagramIcon className="text-[22px] text-[#4A8DFF] transition-all duration-200 ease-in-out group-hover:text-[#E4405F]" />
              <span>Instagram</span>
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-[#e1306c] transition-all duration-300 ease-in-out
        group-hover:w-full"
              />
            </div>

            {/* YouTube */}
            <div
              className="relative inline-flex font-medium items-center gap-[10px] cursor-pointer text-[16px] text-[#4A8DFF] px-[5px] w-fit h-fit transition-all duration-200 ease-in-out
      hover:text-black group"
            >
              <YouTubeIcon className="text-[22px] text-[#4A8DFF] transition-all duration-200 ease-in-out group-hover:text-[#ff0000]" />
              <span>Youtube</span>
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-[#ff0000] transition-all duration-300 ease-in-out
        group-hover:w-full"
              />
            </div>
          </div>

          <div
            className="inline-flex flex-col items-start gap-[10px] cursor-pointer"
            onClick={() => handleDownloadApp()}
          >
            <img
              importance="low"
              loading="lazy"
              decoding="async"
              alt="QR Download App"
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v3/f/f519939e72eccefffb6998f1397901b7.svg"
              className="w-[120px] h-auto rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            />
            <img
              importance="low"
              loading="lazy"
              decoding="async"
              alt="QR Download App"
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v3/1/18339f1ae28fb0c49075916d11b98829.svg"
              className="w-[120px] h-auto rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            />
            <span className="text-[13px] font-medium text-[#666]">
              Quét mã để tải ứng dụng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Footer);
