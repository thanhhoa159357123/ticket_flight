// services/flightService.js
import axios from "axios";

export const TicketService = async () => {
  const res = await axios.get("http://localhost:8000/api/gia-ve");
  return res.data.filter((item) => !item.ma_hang_ve.includes("+"));
};
