import React, { useState, useEffect } from "react";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Visibility as EyeIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  Receipt as ReceiptIcon,
  AttachMoney as CurrencyDollarIcon,
} from "@mui/icons-material";
import axios from "axios";

const XuLyHoanVe = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/notifications/refund-requests"
      );
      setRefundRequests(response.data.requests || []);
    } catch (error) {
      console.error("Lỗi fetch refund requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (maDatVe) => {
    if (!window.confirm(`Bạn có chắc chắn muốn duyệt hoàn vé ${maDatVe}?`))
      return;

    setProcessing((prev) => ({ ...prev, [maDatVe]: true }));
    try {
      await axios.patch(
        `http://localhost:8080/datve/${maDatVe}/approve-refund?approved=true`
      );
      alert("✅ Đã duyệt hoàn vé thành công!");
      fetchRefundRequests();
    } catch (error) {
      console.error("Lỗi approve:", error);
      alert("❌ Có lỗi xảy ra khi duyệt hoàn vé");
    } finally {
      setProcessing((prev) => ({ ...prev, [maDatVe]: false }));
    }
  };

  const handleReject = async (maDatVe) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;

    setProcessing((prev) => ({ ...prev, [maDatVe]: true }));
    try {
      await axios.patch(
        `http://localhost:8080/datve/${maDatVe}/approve-refund?approved=false`
      );
      alert("❌ Đã từ chối hoàn vé!");
      fetchRefundRequests();
    } catch (error) {
      console.error("Lỗi reject:", error);
      alert("❌ Có lỗi xảy ra khi từ chối hoàn vé");
    } finally {
      setProcessing((prev) => ({ ...prev, [maDatVe]: false }));
    }
  };

  // 🔧 Cập nhật getStatusBadge
  const getStatusBadge = (status, trangThaiDuyet) => {
    // Nếu là vé bị từ chối hoàn vé
    if (status === "Đã thanh toán" && trangThaiDuyet === "Từ chối") {
      return "bg-red-100 text-red-800";
    }

    switch (status) {
      case "Chờ duyệt hoàn vé":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hoàn vé":
        return "bg-green-100 text-green-800";
      case "Đã thanh toán":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 🔧 Cập nhật getStatusText
  const getStatusText = (status, trangThaiDuyet) => {
    if (status === "Đã thanh toán" && trangThaiDuyet === "Từ chối") {
      return "Từ chối hoàn vé";
    }
    return status;
  };

  // 🔧 Cập nhật filteredRequests
  const filteredRequests = refundRequests.filter((request) => {
    switch (filter) {
      case "pending":
        return request.trang_thai === "Chờ duyệt hoàn vé";
      case "approved":
        return request.trang_thai === "Đã hoàn vé";
      case "rejected":
        return (
          request.trang_thai === "Đã thanh toán" &&
          request.trang_thai_duyet === "Từ chối"
        );
      default:
        return true;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔧 Cập nhật tabs count
  const tabsConfig = [
    { key: "all", label: "Tất cả", count: refundRequests.length },
    {
      key: "pending",
      label: "Chờ duyệt",
      count: refundRequests.filter(
        (r) => r.trang_thai === "Chờ duyệt hoàn vé"
      ).length,
    },
    {
      key: "approved",
      label: "Đã duyệt",
      count: refundRequests.filter((r) => r.trang_thai === "Đã hoàn vé")
        .length,
    },
    {
      key: "rejected",
      label: "Từ chối",
      count: refundRequests.filter(
        (r) => r.trang_thai === "Đã thanh toán" && r.trang_thai_duyet === "Từ chối"
      ).length,
    },
  ];

  // 🔧 Cập nhật stats cards
  const statsConfig = [
    {
      title: "Chờ duyệt",
      count: refundRequests.filter(
        (r) => r.trang_thai === "Chờ duyệt hoàn vé"
      ).length,
      icon: CalendarIcon,
      color: "yellow",
    },
    {
      title: "Đã duyệt",
      count: refundRequests.filter((r) => r.trang_thai === "Đã hoàn vé")
        .length,
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      title: "Từ chối",
      count: refundRequests.filter(
        (r) => r.trang_thai === "Đã thanh toán" && r.trang_thai_duyet === "Từ chối"
      ).length,
      icon: XCircleIcon,
      color: "red",
    },
    {
      title: "Tổng tiền hoàn",
      count: formatCurrency(
        refundRequests
          .filter((r) => r.trang_thai === "Đã hoàn vé")
          .reduce((sum, r) => sum + (r.gia_ve_hoan || 0), 0)
      ),
      icon: CurrencyDollarIcon,
      color: "blue",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Xử lý hoàn vé</h1>
        <p className="text-gray-600">Quản lý các yêu cầu hoàn vé từ khách hàng</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {tabsConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đặt vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.ma_dat_ve} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ReceiptIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {request.ma_dat_ve}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {request.ma_khach_hang}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(request.gia_ve_hoan || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(request.ngay_yeu_cau_hoan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        request.trang_thai,
                        request.trang_thai_duyet
                      )}`}
                    >
                      {getStatusText(request.trang_thai, request.trang_thai_duyet)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.trang_thai === "Chờ duyệt hoàn vé" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.ma_dat_ve)}
                          disabled={processing[request.ma_dat_ve]}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircleIcon sx={{ fontSize: 16 }} className="mr-1" />
                          {processing[request.ma_dat_ve]
                            ? "Đang xử lý..."
                            : "Duyệt"}
                        </button>
                        <button
                          onClick={() => handleReject(request.ma_dat_ve)}
                          disabled={processing[request.ma_dat_ve]}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircleIcon sx={{ fontSize: 16 }} className="mr-1" />
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {request.trang_thai === "Đã hoàn vé"
                          ? "Đã duyệt"
                          : request.trang_thai === "Đã thanh toán" &&
                            request.trang_thai_duyet === "Từ chối"
                          ? "Đã từ chối"
                          : "Đã xử lý"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <ReceiptIcon
              sx={{ fontSize: 48 }}
              className="mx-auto text-gray-400"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có yêu cầu hoàn vé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "pending"
                ? "Hiện tại không có yêu cầu hoàn vé nào đang chờ duyệt."
                : "Không tìm thấy yêu cầu hoàn vé nào."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default XuLyHoanVe;