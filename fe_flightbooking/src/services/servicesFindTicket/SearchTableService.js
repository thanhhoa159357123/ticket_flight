// SearchTableService.jsx
import axios from "axios";

export const fetchAirports = async () => {
  const res = await axios.get("http://localhost:8000/api/san-bay");
  return res.data.map((item) => ({
    name: item.ten_san_bay,
    code: item.ma_san_bay,
    display: `${item.ten_san_bay} - ${item.ma_san_bay}`,
  }));
};

export const searchFlights = async ({ from, to, selected }) => {
  const response = await fetch(
    `http://localhost:8000/api/gia-ve/search-ve?from_airport=${from}&to_airport=${to}&vi_tri_ngoi=${selected}`
  );
  const data = await response.json();
  return data;
};
