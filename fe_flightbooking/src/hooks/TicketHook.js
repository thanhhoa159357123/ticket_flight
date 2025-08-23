import { useEffect, useState } from "react";
import { ticketService } from "../services/TicketService";
import { useLocation } from "react-router-dom";

export const useTickets = () => {
  const location = useLocation();
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ Ưu tiên lấy dữ liệu từ `location.state`
        const state = location.state;
        if (state?.results || state?.outboundFlights) {
          const results = state.results || state.outboundFlights;
          if (isMounted) {
            setFlightResults(Array.isArray(results) ? results : []);
          }
          return;
        }

        // ✅ Nếu không có state, ưu tiên cache
        const cached = sessionStorage.getItem("ticketPrices");
        if (cached) {
          if (isMounted) setFlightResults(JSON.parse(cached));
          return;
        }

        // ✅ Nếu chưa có cache → gọi API
        const data = await ticketService.getTicketPrices();
        if (isMounted) setFlightResults(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy vé máy bay:", err);
        if (isMounted) {
          setError("Không thể tải danh sách vé. Vui lòng thử lại sau.");
          setFlightResults([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, [location.state]);

  return { flightResults, loading, error };
};
