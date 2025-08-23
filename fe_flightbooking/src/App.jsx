import "./App.scss";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Ticket = lazy(() => import(/* webpackPrefetch: true */ "./pages/ticket/Ticket"));
const Detail_Account = lazy(() =>
  import("./pages/DetailAccount/Detail_Account")
);
const Booking = lazy(() => import("./pages/booking/Booking"));
const CheckOut = lazy(() => import("./pages/CheckOut"));
const Payment = lazy(() => import("./pages/Payment"));
const Success = lazy(() => import("./pages/Success"));

import MainLayout from "./MainLayout";

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Đang tải trang...</div>}>
        <Routes>
          {/* Các route dùng chung layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
            <Route path="flight-ticket" element={<Ticket />} />
            <Route path="detail-account" element={<Detail_Account />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="payment" element={<Payment />} />
            <Route path="success" element={<Success />} />
          </Route>

          {/* Các route không dùng layout (auth, error, ...) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
