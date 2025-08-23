import { useState, useEffect } from "react";
import { fetchSingleTicketPackage } from "../../../../services/TicketOptionalsPanelService";

export default function useRoundTripPackages(show, selectedOutbound, selectedReturn) {
  const [outboundPackages, setOutboundPackages] = useState([]);
  const [returnPackages, setReturnPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [packagesLoaded, setPackagesLoaded] = useState(false);

  useEffect(() => {
    if (show && !packagesLoaded) loadAllPackages();
  }, [show, selectedOutbound, selectedReturn]);

  const loadAllPackages = async () => {
    if (!selectedOutbound?.ma_ve || !selectedReturn?.ma_ve) return;
    setLoading(true);
    try {
      const [outboundPkgs, returnPkgs] = await Promise.all([
        fetchSingleTicketPackage(selectedOutbound.ma_ve),
        fetchSingleTicketPackage(selectedReturn.ma_ve),
      ]);

      setOutboundPackages(outboundPkgs || []);
      setReturnPackages(returnPkgs || []);
      setPackagesLoaded(true);
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    outboundPackages,
    returnPackages,
    loading,
  };
}
