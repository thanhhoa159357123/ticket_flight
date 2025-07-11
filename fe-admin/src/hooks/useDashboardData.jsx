import { useState, useEffect } from "react";
import {
  fetchRevenueData,
  fetchTopDestinations,
  fetchBookings,
} from "../services/dashboardService";

export function useDashboardData() {
  const [revenueData, setRevenueData] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchRevenueData(),
      fetchTopDestinations(),
      fetchBookings(),
    ])
      .then(([revenue, topDest, bookings]) => {
        setRevenueData(revenue);
        setTopDestinations(topDest);
        setBookings(bookings);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    revenueData,
    topDestinations,
    bookings,
    loading,
  };
}
