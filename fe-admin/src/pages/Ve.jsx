import React, { useState, useEffect } from "react";
import { useVeData } from "../hooks/hookVeData/useVeData";
import { useVeFilter } from "../hooks/hookVeData/useVeFilter";
import { usePagination } from "../hooks/hookVeData/usePagination";
import { useVeForm } from "../hooks/hookVeData/useVeForm";

const Ve = () => {
  const [message, setMessage] = useState("");

  // Custom hooks
  const {
    veData,
    hangVeData,
    chuyenBayData,
    hangBanVeData,
    loading,
    error,
    refreshVeData,
  } = useVeData();

  const {
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
  } = useVeFilter(veData);

  const {
    currentPage,
    totalPages,
    currentData,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(filteredAndSortedData);

  const {
    showForm,
    setShowForm,
    formData,
    importing,
    importResult,
    fileInputRef,
    handleChange,
    handleAdd,
    handleFileSelect,
    resetForm,
  } = useVeForm(refreshVeData);

  // 🔥 Debug data structure
  useEffect(() => {
    console.log("🔍 Debug data structure:", {
      veDataSample: veData.slice(0, 2),
      hangVeDataSample: hangVeData.slice(0, 2),
      chuyenBayDataSample: chuyenBayData.slice(0, 2),
      hangBanVeDataSample: hangBanVeData.slice(0, 2),
    });
  }, [veData, hangVeData, chuyenBayData, hangBanVeData]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // 🔥 Helper function để tìm thông tin hạng vé
  const getHangVeInfo = (maHangVe) => {
    console.log("🔍 Looking for hang ve:", maHangVe, "in data:", hangVeData);

    const hangVe = hangVeData.find((hv) => {
      // Thử nhiều field có thể có
      return (
        hv.ma_hang_ve === maHangVe ||
        hv.ma_gia_ve === maHangVe ||
        hv.id === maHangVe ||
        hv._id === maHangVe
      );
    });

    console.log("🎯 Found hang ve:", hangVe);

    if (hangVe) {
      // Thử nhiều field name có thể có
      return (
        hangVe.ten_hang_ve ||
        hangVe.vi_tri_ngoi ||
        hangVe.loai_hang_ve ||
        hangVe.hang_ve ||
        maHangVe
      );
    }

    return maHangVe || "N/A";
  };

  // 🔥 Helper function để tìm thông tin hãng bán vé
  const getHangBanVeInfo = (maHangBanVe) => {
    const hangBanVe = hangBanVeData.find((hbv) => {
      return (
        hbv.ma_hang_ban_ve === maHangBanVe ||
        hbv.id === maHangBanVe ||
        hbv._id === maHangBanVe
      );
    });

    if (hangBanVe) {
      return (
        hangBanVe.ten_hang_ban_ve ||
        hangBanVe.ten_hang ||
        hangBanVe.name ||
        maHangBanVe
      );
    }

    return maHangBanVe || "N/A";
  };

  // Handle add with error handling
  const handleAddVe = async () => {
    try {
      await handleAdd();
      setMessage("✅ Thêm vé thành công");
    } catch (err) {
      setMessage(`❌ ${err.message || "Lỗi không xác định"}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700 pb-2">Danh sách vé</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              resetForm();
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          {showForm ? "Đóng" : "Thêm vé"}
        </button>
      </div>

      {/* Message */}
      {(message || error) && (
        <div
          className={`mb-4 p-3 rounded ${
            message && message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message || error}
        </div>
      )}

      {/* Import Excel Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Import dữ liệu từ Excel
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {importing && (
            <div className="flex items-center text-blue-600">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang import...
            </div>
          )}
        </div>

        {/* Import Result */}
        {importResult && (
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm">
              <span className="font-semibold text-green-600">
                Thành công: {importResult.success_count}
              </span>
              {importResult.error_count > 0 && (
                <span className="ml-4 font-semibold text-red-600">
                  Lỗi: {importResult.error_count}
                </span>
              )}
            </p>
            {importResult.errors && importResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600">
                  Lỗi chi tiết:
                </p>
                <ul className="text-xs text-red-500 ml-4 list-disc">
                  {importResult.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {importResult.total_errors > 5 && (
                    <li>... và {importResult.total_errors - 5} lỗi khác</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-sm text-gray-600">
          <p>
            <strong>Format Excel yêu cầu:</strong> ma_ve, gia_ve, ma_hang_ve,
            ma_chuyen_bay, ma_hang_ban_ve
          </p>
        </div>
      </div>

      {/* Add Form - Bỏ field goi_ve */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Thêm vé mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="ma_ve"
              value={formData.ma_ve}
              onChange={handleChange}
              placeholder="Mã vé"
              className="p-2 border rounded"
            />
            <input
              name="gia_ve"
              value={formData.gia_ve}
              onChange={handleChange}
              placeholder="Giá vé"
              type="number"
              className="p-2 border rounded"
            />
            <select
              name="ma_hang_ve"
              value={formData.ma_hang_ve}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Chọn hạng vé</option>
              {hangVeData.map((item) => (
                <option
                  key={item.ma_hang_ve || item._id}
                  value={item.ma_hang_ve || item._id}
                >
                  {item.ma_hang_ve || item._id} -{" "}
                  {getHangVeInfo(item.ma_hang_ve || item._id)}
                </option>
              ))}
            </select>
            <select
              name="ma_chuyen_bay"
              value={formData.ma_chuyen_bay}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Chọn chuyến bay</option>
              {chuyenBayData.map((item) => (
                <option
                  key={item.ma_chuyen_bay || item._id}
                  value={item.ma_chuyen_bay || item._id}
                >
                  {item.ma_chuyen_bay || item._id} - {item.thoi_gian_di} đến{" "}
                  {item.thoi_gian_den}
                </option>
              ))}
            </select>
            <select
              name="ma_hang_ban_ve"
              value={formData.ma_hang_ban_ve}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Chọn hãng bán vé</option>
              {hangBanVeData.map((item) => (
                <option
                  key={item.ma_hang_ban_ve || item._id}
                  value={item.ma_hang_ban_ve || item._id}
                >
                  {item.ma_hang_ban_ve || item._id} -{" "}
                  {getHangBanVeInfo(item.ma_hang_ban_ve || item._id)}
                </option>
              ))}
            </select>
            {/* 🔥 Bỏ input goi_ve */}
            <div>
              <button
                onClick={handleAddVe}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Thêm vé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Tìm kiếm và lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm theo mã vé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filterHangVe}
            onChange={(e) => setFilterHangVe(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Tất cả hạng vé</option>
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
          <input
            type="text"
            placeholder="Tìm theo mã chuyến bay..."
            value={filterChuyenBay}
            onChange={(e) => setFilterChuyenBay(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Giá từ..."
            value={filterPriceRange.min}
            onChange={(e) =>
              setFilterPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Giá đến..."
            value={filterPriceRange.max}
            onChange={(e) =>
              setFilterPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Hiển thị {currentData.length} trên {filteredAndSortedData.length} kết
          quả
          {filteredAndSortedData.length !== veData.length &&
            ` (lọc từ ${veData.length} tổng cộng)`}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Hiển thị:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm">mục/trang</span>
        </div>
      </div>

      {/* Data Table - Bỏ cột Gói vé */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("ma_ve")}
              >
                Mã vé {getSortIcon("ma_ve")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("gia_ve")}
              >
                Giá vé {getSortIcon("gia_ve")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("ma_hang_ve")}
              >
                Hạng vé {getSortIcon("ma_hang_ve")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("ma_chuyen_bay")}
              >
                Chuyến bay {getSortIcon("ma_chuyen_bay")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("ma_hang_ban_ve")}
              >
                Hãng bán vé {getSortIcon("ma_hang_ban_ve")}
              </th>
              {/* 🔥 Bỏ cột Gói vé */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((ve, index) => (
              <tr
                key={`${ve.ma_ve || ve._id}-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ve.ma_ve || ve._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(ve.gia_ve || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getHangVeInfo(ve.ma_hang_ve)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ve.ma_chuyen_bay || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getHangBanVeInfo(ve.ma_hang_ban_ve)}
                </td>
                {/* 🔥 Bỏ cột goi_ve */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    ✏️ Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {filteredAndSortedData.length === 0
              ? "Không tìm thấy dữ liệu phù hợp"
              : "Không có dữ liệu"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Trang {currentPage} trên {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮️ Đầu
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀️ Trước
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${
                    currentPage === pageNum ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶️ Sau
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏭️ Cuối
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ve;
