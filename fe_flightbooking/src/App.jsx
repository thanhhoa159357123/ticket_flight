import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Ticket from "./pages/ticket/Ticket";
import Detail_Account from "./pages/DetailAccount/Detail_Account";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flight-ticket" element={<Ticket />} />
        <Route path="/detail-account" element={<Detail_Account />} />
      </Routes>
    </Router>
  );
}

export default App;
