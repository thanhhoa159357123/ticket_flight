import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchSeatPositions = async () => {
  const res = await axios.get(`${BASE_URL}/hang-ve`);
  return res.data;
};

export const fetchTripTypes = async () => {
  const res = await axios.get(`${BASE_URL}/loai-chuyen-di`);
  return res.data;
};

export const findTripTypeByName = async (name) => {
  const all = await fetchTripTypes();
  return all.find((item) => item.ten_chuyen_di === name);
};
