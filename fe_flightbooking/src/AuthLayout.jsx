import clouds from "./assets/clouds.jpg";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => (
  <div
    className="min-h-screen relative flex flex-col bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${clouds})` }}
  >
    <div className="absolute inset-0 bg-white/50 z-0" />
    <div className="ml-5 mt-3 z-10">
      <Link to="/" className="inline-block">
        <span className="text-[40px] font-extrabold bg-[linear-gradient(to_right,#017EBE,#0085E4,#4A8DFF,#7E96FF)] bg-clip-text text-transparent no-underline tracking-tighter">
          H&T
        </span>
      </Link>
    </div>
    <div className="flex justify-center items-center flex-1 p-8 z-10">
      {children}
    </div>
  </div>
);

export default AuthLayout;
