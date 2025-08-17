import React, { useEffect, useState } from "react";
import axios from "axios";
import Detail_History_Ticket from "../../components/detail_history_ticket/Detail_History_Ticket";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Item_History_Ticket = ({ maKhachHang }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Helper lấy chiều đi/về từ model mới
  const getChieuDi = (val) => Array.isArray(val) ? val[0] : val;
  const getChieuVe = (val) => Array.isArray(val) && val.length > 1 ? val[1] : null;

  const handleViewDetail = async (ticket) => {
    try {
      const chiTietRes = await axios.get(
        `http://localhost:8000/chitietvedat/by-ma-dat-ve/${ticket.ma_dat_ve}`
      );
      const chiTietVeDat = chiTietRes.data?.chi_tiet_ve_list || [];
      const maHanhKhachList = chiTietVeDat.flatMap(
        (item) => item.ma_hanh_khach || []
      );
      let passengers = [];
      if (maHanhKhachList.length > 0) {
        const passengersRes = await axios.post(
          `http://localhost:8000/hanhkhach/get-multiple`,
          { ma_hanh_khach_list: maHanhKhachList },
          { headers: { "Content-Type": "application/json" } }
        );
        passengers = passengersRes.data?.hanh_khach_list || [];
      }
      const enrichedTicket = {
        ...ticket,
        ma_hanh_khach: maHanhKhachList,
        passengers,
        chi_tiet_ve_dat: chiTietVeDat,
      };
      setSelectedTicket(enrichedTicket);
      setShowDetail(true);
    } catch (error) {
      alert("Không thể hiển thị chi tiết vé: ", error);
    }
  };

  useEffect(() => {
    if (!maKhachHang) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/datve/all`,
          { params: { ma_khach_hang: maKhachHang } }
        );
        setTickets(Array.isArray(response.data) ? response.data : []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maKhachHang]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">
          Không có vé nào được đặt
        </h3>
        <p className="text-gray-500 mt-1">Bạn chưa có lịch sử đặt vé nào</p>
      </div>
    );
  }
  console.log("Dữ liệu vé máy bay: ", tickets)

  // Helper để lấy giá trị hoặc fallback
  const getOrDefault = (val, fallback = "N/A") =>
    val !== undefined && val !== null && val !== "" ? val : fallback;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử đặt vé</h2>
        <div className="text-sm text-gray-500">
          {tickets.length} vé được tìm thấy
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại chuyến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã chuyến bay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã hạng vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket, index) => (
                <tr key={ticket.ma_dat_ve || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {getOrDefault(ticket.ma_dat_ve)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getOrDefault(ticket.loai_chuyen_di, "Một chiều")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span>{getOrDefault(getChieuDi(ticket.ma_chuyen_bay))}</span>
                      {ticket.loai_chuyen_di === "Khứ hồi" && getChieuVe(ticket.ma_chuyen_bay) && (
                        <>
                          <br />
                          <span>{getOrDefault(getChieuVe(ticket.ma_chuyen_bay))}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span>{getOrDefault(getChieuDi(ticket.ma_hang_ve))}</span>
                      {ticket.loai_chuyen_di === "Khứ hồi" && getChieuVe(ticket.ma_hang_ve) && (
                        <>
                          <br />
                          <span>{getOrDefault(getChieuVe(ticket.ma_hang_ve))}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {ticket.ngay_dat
                        ? new Date(ticket.ngay_dat).toLocaleDateString()
                        : "N/A"}
                      <span className="block text-xs text-gray-400">
                        {ticket.ngay_dat
                          ? new Date(ticket.ngay_dat).toLocaleTimeString()
                          : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.trang_thai === "Đã hủy"
                          ? "bg-red-100 text-red-800"
                          : ticket.trang_thai === "Đã thanh toán"
                          ? "bg-green-100 text-green-800"
                          : ticket.trang_thai === "Đã hoàn vé"
                          ? "bg-purple-100 text-purple-800"
                          : ticket.trang_thai === "Chờ duyệt hoàn vé"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getOrDefault(ticket.trang_thai)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetail(ticket)}
                      className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedTicket && (
        <Detail_History_Ticket
          ticket={selectedTicket}
          show={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
};

export default Item_History_Ticket;