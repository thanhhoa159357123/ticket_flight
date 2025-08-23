import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAirports } from "../../services/servicesFindTicket/airportService";
import { searchFlights } from "../../services/servicesFindTicket/flightService";
import { debounce } from "lodash";

export const useSearchTableData = () => {
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSwapLocation = useCallback(() => {
    if (!from || !to) return;
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const saveSearchData = useCallback((data) => {
    localStorage.setItem("ticketSearchData", JSON.stringify(data));
    navigate("/flight-ticket");
  }, [navigate]);

  const searchHandler = useCallback(
    async (selectedWay, selected, passengers) => {
      if (!from || !to || !selected) {
        alert("Vui lòng điền đủ thông tin tìm kiếm");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const isRoundTrip = selectedWay === "Khứ hồi";

        if (isRoundTrip) {
          const [outboundFlights, returnFlights] = await Promise.all([
            searchFlights({ from, to, selected, departureDate }),
            searchFlights({
              from: to,
              to: from,
              selected,
              departureDate: returnDate || departureDate,
            }),
          ]);

          saveSearchData({
            searchType: "roundtrip",
            searchInfo: { from, to, departureDate, returnDate, selectedWay, selected, passengers },
            outboundFlights,
            returnFlights,
          });
        } else {
          const data = await searchFlights({ from, to, selected, departureDate });

          saveSearchData({
            searchType: "oneway",
            searchInfo: { from, to, departureDate, selectedWay, selected, passengers },
            outboundFlights: data,
          });
        }
      } catch (err) {
        console.error("❌ Lỗi khi tìm vé:", err);
        setError("Không thể tìm vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    },
    [from, to, departureDate, returnDate, saveSearchData]
  );

  // ✅ Memo hóa debounce để ổn định hơn
  const handleSearch = useMemo(() => debounce(searchHandler, 600), [searchHandler]);

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        const locations = await fetchAirports();
        if (isMounted) {
          setSelectedLocation(locations);
          if (locations.length >= 2) {
            setFrom(locations[0].code);
            setTo(locations[1].code);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching airports:", err);
        if (isMounted) setError("Không thể tải danh sách sân bay");
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    selectedLocation,
    from,
    setFrom,
    to,
    setTo,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    handleSwapLocation,
    handleSearch,
    loading,
    error,
  };
};
