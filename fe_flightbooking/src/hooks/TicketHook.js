// hooks/TicketHook.js
import { useEffect, useState } from "react";
import { TicketService } from "../services/TicketService";
import { useLocation } from "react-router-dom";

export const Tickets = () => {
  const location = useLocation();
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const data = await TicketService();
        setFlightResults(data);
      } catch (err) {
        console.error("Lỗi fetch toàn bộ vé:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.results) {
      setFlightResults(location.state.results);
      setLoading(false);
    } else {
      fetchAllTickets();
    }
  }, [location.state]);

  return { flightResults, loading };
};
