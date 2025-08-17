// service/TicketService.jsx
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const ticketService = {
  // Get all ticket prices
  getTicketPrices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ve`);
      return response.data
      // .filter((item) => !item.ma_hang_ve.includes("+"));
    } catch (error) {
      console.error("Error fetching ticket prices:", error);
      throw error;
    }
  },

  // Search flights
  searchFlights: async (searchParams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search-flights`, searchParams);
      return response.data;
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  },
};

// Backward compatibility
export const TicketService = ticketService.getTicketPrices;

