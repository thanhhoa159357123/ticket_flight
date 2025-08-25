import { useState, useMemo } from "react";

export const useVeFilter = (veData) => {
  const [sortField, setSortField] = useState("ma_ve");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHangVe, setFilterHangVe] = useState("");
  const [filterChuyenBay, setFilterChuyenBay] = useState("");
  const [filterPriceRange, setFilterPriceRange] = useState({
    min: "",
    max: "",
  });

  // Xử lý sắp xếp cột
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Icon sắp xếp
  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Dữ liệu lọc + sắp xếp
  const filteredAndSortedData = useMemo(() => {
    let filteredData = veData.filter((ve) => {
      // Tìm kiếm theo mã vé hoặc gói vé (fallback nếu gói vé có)
      const matchesSearch =
        searchTerm === "" ||
        (ve.ma_ve &&
          ve.ma_ve.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ve.goi_ve &&
          ve.goi_ve.toLowerCase().includes(searchTerm.toLowerCase()));

      // Lọc theo hạng vé
      const matchesHangVe =
        filterHangVe === "" ||
        getHangVeName(ve).toLowerCase().startsWith(filterHangVe.toLowerCase());

      // Hàm helper để lấy tên hạng vé đầy đủ
      function getHangVeName(ve) {
        return (
          ve.ten_hang_ve || ve.loai_hang_ve || ve.hang_ve || ve.ma_hang_ve || ""
        );
      }

      // 🔹 Lọc theo mã chuyến bay (mới thêm)
      const matchesChuyenBay =
        filterChuyenBay === "" ||
        (ve.ma_chuyen_bay &&
          ve.ma_chuyen_bay
            .toLowerCase()
            .includes(filterChuyenBay.toLowerCase()));

      // Lọc theo giá vé
      const matchesPrice =
        (filterPriceRange.min === "" ||
          parseFloat(ve.gia_ve || ve.gia || 0) >=
            parseFloat(filterPriceRange.min)) &&
        (filterPriceRange.max === "" ||
          parseFloat(ve.gia_ve || ve.gia || 0) <=
            parseFloat(filterPriceRange.max));

      return matchesSearch && matchesHangVe && matchesChuyenBay && matchesPrice;
    });

    // Sắp xếp dữ liệu
    filteredData.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "gia" || sortField === "gia_ve") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredData;
  }, [
    veData,
    searchTerm,
    filterHangVe,
    filterChuyenBay,
    filterPriceRange,
    sortField,
    sortDirection,
  ]);

  return {
    filteredAndSortedData,
    searchTerm,
    setSearchTerm,
    filterHangVe,
    setFilterHangVe,
    filterChuyenBay,
    setFilterChuyenBay,
    filterPriceRange,
    setFilterPriceRange,
    handleSort,
    getSortIcon,
    sortField,
    sortDirection,
  };
};
