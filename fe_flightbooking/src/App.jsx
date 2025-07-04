import "./App.scss";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Ticket = lazy(() => import("./pages/ticket/Ticket"));
const Detail_Account = lazy(() => import("./pages/DetailAccount/Detail_Account"));
const Booking = lazy(() => import("./pages/booking/Booking"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Đang tải trang...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flight-ticket" element={<Ticket />} />
          <Route path="/detail-account" element={<Detail_Account />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

