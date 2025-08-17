// SearchTableService.jsx
import axios from "axios";

export const fetchAirports = async () => {
  const res = await axios.get("http://localhost:8000/sanbay");
  return res.data.map((item) => ({
    name: item.ten_san_bay,
    code: item.ma_san_bay,
  }));
};

export const searchFlights = async ({ from, to, selected }) => {
  try {

    const url = `http://localhost:8000/ve/search-ve?from_airport=${encodeURIComponent(from)}&to_airport=${encodeURIComponent(to)}&ten_hang_ve=${encodeURIComponent(selected)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Search flights error:', error);
    throw error;
  }
};
