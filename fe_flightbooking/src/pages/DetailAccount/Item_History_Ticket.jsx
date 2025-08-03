import React, { useEffect, useState } from "react";
import axios from "axios";
import Detail_History_Ticket from "../../components/detail_history_ticket/Detail_History_Ticket";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Item_History_Ticket = ({ maKhachHang }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetail = async (ticket) => {
    try {
      // 1. Lấy chi tiết vé đặt
      const chiTietRes = await axios.get(
        `http://localhost:8000/api/chi-tiet-ve-dat/by-ma-dat-ve/${ticket.ma_dat_ve}`
      );
      const chiTietVeDat = chiTietRes.data?.chi_tiet_ve_list || [];

      // 2. Lấy danh sách mã hành khách
      const maHanhKhachList = chiTietVeDat.flatMap(
        (item) => item.ma_hanh_khach || []
      );

      // 3. Gọi API lấy thông tin hành khách từ danh sách mã
      let passengers = [];
      if (maHanhKhachList.length > 0) {
        const passengersRes = await axios.post(
          `http://localhost:8000/api/hanh-khach/get-multiple`,
          {
            ma_hanh_khach_list: maHanhKhachList,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        passengers = passengersRes.data?.hanh_khach_list || [];
      }

      // 4. Gắn danh sách mã + tên hành khách vào ticket
      const enrichedTicket = {
        ...ticket,
        ma_hanh_khach: maHanhKhachList,
        passengers,
        chi_tiet_ve_dat: chiTietVeDat
      };
      setSelectedTicket(enrichedTicket);
      setShowDetail(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hành khách:", error);
      alert("Không thể hiển thị chi tiết vé.");
    }
  };

  useEffect(() => {
    if (!maKhachHang) return;

    const fetchData = async () => {
      try {        
        const response = await axios.get(
          `http://localhost:8000/api/dat-ve/all`,
          {
            params: { ma_khach_hang: maKhachHang },
          }
        );        
        // ✅ Xử lý data trả về
        const ticketsData = Array.isArray(response.data) ? response.data : [];
        
        setTickets(ticketsData);
      } catch (error) {
        console.error("❌ Error fetching tickets:", error);
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã vé
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại chuyến
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuyến bay
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng vé
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket, index) => (
                <tr key={ticket.ma_dat_ve || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {ticket.ma_dat_ve || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ticket.loai_chuyen_di || "Một chiều"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        {/* Chiều đi */}
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {ticket.ten_san_bay_di || "N/A"}
                          </span>
                          <ArrowDownwardIcon className="text-gray-400 mx-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {ticket.ten_san_bay_den_di || "N/A"}
                          </span>
                        </div>

                        {/* Chiều về (nếu có) */}
                        {ticket.loai_chuyen_di === "Khứ hồi" && ticket.ten_san_bay_di_ve && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{ticket.ten_san_bay_di_ve}</span>
                            <ArrowDownwardIcon className="mx-1" style={{ fontSize: "12px" }} />
                            <span>{ticket.ten_san_bay_den_ve}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      {/* Hạng vé chiều đi */}
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                        {ticket.vi_tri_ngoi_di || ticket.vi_tri_ngoi || "N/A"}
                      </span>

                      {/* Hạng vé chiều về (nếu có) */}
                      {ticket.loai_chuyen_di === "Khứ hồi" && ticket.vi_tri_ngoi_ve && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {ticket.vi_tri_ngoi_ve}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {ticket.ngay_dat ? new Date(ticket.ngay_dat).toLocaleDateString() : 'N/A'}
                      <span className="block text-xs text-gray-400">
                        {ticket.ngay_dat ? new Date(ticket.ngay_dat).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.trang_thai === "Đã hủy"
                        ? "bg-red-100 text-red-800"
                        : ticket.trang_thai === "Đã thanh toán"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {ticket.trang_thai || 'N/A'}
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

      {/* ✅ Chỉ render modal khi có selectedTicket */}
      {selectedTicket && (
        <Detail_History_Ticket
          ticket={selectedTicket}
          show={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedTicket(null); // Reset selected ticket
          }}
        />
      )}
    </div>
  );
};

export default Item_History_Ticket;