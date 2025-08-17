// hooks/TicketHook.js
import { useEffect, useState } from "react";
import { ticketService } from "../services/TicketService";
import { useLocation } from "react-router-dom";

export const Tickets = () => {
  const location = useLocation();
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setLoading(true);

        // ✅ Ưu tiên dùng kết quả search từ navigation
        if (location.state?.results || location.state?.outboundFlights) {
          console.log("📍 Using search results from navigation");
          const results =
            location.state.results || location.state.outboundFlights || [];
          console.log("📍 Search results count:", results.length);
          console.log("📍 Sample result:", results[0]); // Debug first item
          setFlightResults(results);
          setLoading(false);
          return;
        }

        // ✅ Fallback: lấy tất cả vé (tạm bỏ filter)
        console.log("📍 No search results, fetching all tickets...");
        const data = await ticketService.getTicketPrices();
        console.log("📍 All tickets count:", data?.length);
        setFlightResults(data || []);
      } catch (err) {
        console.error("❌ TicketHook error:", err);
        setFlightResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, [location.state]);

  console.log("📍 TicketHook final:", {
    flightResultsCount: flightResults?.length,
    loading,
    hasLocationState: !!location.state,
  });

  return { flightResults, loading };
};
