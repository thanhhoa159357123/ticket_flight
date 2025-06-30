import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ticket from "./pages/ticket/Ticket";
import Detail_Account from "./pages/DetailAccount/Detail_Account";
import Booking from "./pages/booking/Booking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flight-ticket" element={<Ticket />} />
        <Route path="/detail-account" element={<Detail_Account />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;
