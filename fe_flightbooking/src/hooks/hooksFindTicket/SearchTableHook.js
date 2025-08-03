// SearchTableHook.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAirports, searchFlights } from "../../services/servicesFindTicket/SearchTableService";

export const useSearchTableData = ({
  selectedWay,
  selected,
  passengers,
  setFrom,
  setTo,
  from,
  to,
}) => {
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [hasSetDefaults, setHasSetDefaults] = useState(false);
  const navigate = useNavigate();

  const isOneWay = selectedWay === "Một chiều";
  const isRoundTrip = selectedWay === "Khứ hồi";

  const handleSwapLocation = () => {
    if (!from || !to) return;
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  };

  const handleSearch = async (from, to) => {
    try {
      if (isRoundTrip) {
        const [outboundData, returnData] = await Promise.all([
          searchFlights({ from, to, selected }),
          searchFlights({ from: to, to: from, selected }),
        ]);
        
        navigate("/flight-ticket", {
          state: {
            searchType: "roundtrip",
            outboundFlights: outboundData,
            returnFlights: returnData,
            passengers,
            searchInfo: {
              from,
              to,
              departureDate,
              returnDate,
              selectedWay,
              selected,
            },
          },
        });
      } else {
        const data = await searchFlights({ from, to, selected });
        navigate("/flight-ticket", {
          state: {
            searchType: "oneway",
            results: data,
            passengers,
            searchInfo: { from, to, departureDate, selectedWay, selected },
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi tìm vé:", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await fetchAirports();
        setSelectedLocation(locations);

        if (locations.length > 1 && !hasSetDefaults && !from && !to) {
          setFrom(locations[0].code);
          setTo(locations[1].code);
          setHasSetDefaults(true);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [from, hasSetDefaults, setFrom, setTo, to]);

  return {
    selectedLocation,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    isOneWay,
    isRoundTrip,
    handleSwapLocation,
    handleSearch,
  };
};
