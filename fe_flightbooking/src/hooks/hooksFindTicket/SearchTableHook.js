// SearchTableHook.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAirports,
  searchFlights,
} from "../../services/servicesFindTicket/SearchTableService";

export const useSearchTableData = () => {
  // ✅ SearchTable states - one-way only
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  // const [returnDate, setReturnDate] = useState(null); // ❌ Comment out

  const navigate = useNavigate();

  const handleSwapLocation = () => {
    if (!from || !to) return;
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  };

  const handleSearch = async (selectedWay, selected, passengers) => {
    try {
      // ❌ Comment out round trip logic
      // const isRoundTrip = selectedWay === "Khứ hồi";

      if (!from || !to || !selected) {
        console.error("❌ Missing required fields:", { from, to, selected });
        alert("Vui lòng điền đầy đủ thông tin tìm kiếm");
        return;
      }

      // ❌ Comment out round trip branch
      // if (isRoundTrip) {
      //   console.log("🔍 Searching round trip flights...");
      //
      //   const [outboundData, returnData] = await Promise.all([
      //     searchFlights({ from, to, selected, departureDate }),
      //     searchFlights({
      //       from: to,
      //       to: from,
      //       selected,
      //       departureDate: returnDate || departureDate,
      //     }),
      //   ]);
      //
      //   console.log("✅ Round trip search results:", {
      //     outbound: outboundData?.length,
      //     return: returnData?.length
      //   });
      //
      //   navigate("/flight-ticket", {
      //     state: {
      //       searchType: "roundtrip",
      //       searchInfo: {
      //         from, to, departureDate, returnDate, selectedWay, selected, passengers
      //       },
      //       outboundFlights: outboundData || [],
      //       returnFlights: returnData || [],
      //     },
      //   });
      // } else {

      const data = await searchFlights({ from, to, selected, departureDate });

      navigate("/flight-ticket", {
        state: {
          searchType: "oneway",
          searchInfo: {
            from,
            to,
            departureDate,
            selectedWay,
            selected,
            passengers,
          },
          results: data || [],
          outboundFlights: data || [],
        },
      });
      // }

    } catch (error) {
      console.error("❌ Lỗi khi tìm vé:", error);
      alert("Không thể tìm vé. Vui lòng thử lại sau.");
    }
  };

  // ✅ Load airports
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await fetchAirports();
        setSelectedLocation(locations);

        // Set default values nếu chưa có
        if (locations.length > 1 && !from && !to) {
          setFrom(locations[0].code);
          setTo(locations[1].code);
        }
      } catch (error) {
        console.error("❌ Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return {
    selectedLocation,
    from,
    setFrom,
    to,
    setTo,
    departureDate,
    setDepartureDate,
    // returnDate, setReturnDate, // ❌ Comment out
    handleSwapLocation,
    handleSearch,
  };
};
