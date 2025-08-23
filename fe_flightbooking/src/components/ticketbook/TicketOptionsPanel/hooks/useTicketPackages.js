import { useEffect, useState } from "react";
import { fetchSingleTicketPackage } from "../../../../services/TicketOptionalsPanelService";

export default function useTicketPackages(show, flight) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!show || !flight) return;
      const flightId = flight.ma_ve || flight.ma_gia_ve || flight.id;
      if (!flightId) {
        setError("Không tìm thấy mã vé");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchSingleTicketPackage(flightId);
        setPackages(data || []);
        if (!data.length) setError("Không có gói vé khả dụng");
      } catch {
        setError("Không thể tải gói vé từ server");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [show, flight]);

  return { packages, loading, error };
}
