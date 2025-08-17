import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const fetchTripTypes = async () => {
  const res = await axios.get(`${BASE_URL}/loaichuyendi`);
  return res.data;
};

export const fetchSeatPositions = async () => {
  const res = await axios.get(`${BASE_URL}/hangve`);
  return res.data;
};


// export const findTripTypeByName = async (name) => {
//   const all = await fetchTripTypes();
//   return all.find((item) => item.ten_chuyen_di === name);
// };
