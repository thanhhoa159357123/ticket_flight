import React, { useEffect, useState } from "react";
import axios from "axios";

const Hang_ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_hang_ve: "",
    vi_tri_ngoi: "",
    so_kg_hanh_ly_ky_gui: "",
    so_kg_hanh_ly_xach_tay: "",
    so_do_ghe: "",
    khoang_cach_ghe: "",
    refundable: "false",
    changeable: "false",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api/hang-ve")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const payload = {
      ...formData,
      so_kg_hanh_ly_ky_gui: Number(formData.so_kg_hanh_ly_ky_gui),
      so_kg_hanh_ly_xach_tay: Number(formData.so_kg_hanh_ly_xach_tay),
      refundable: formData.refundable === "true",
      changeable: formData.changeable === "true",
    };

    axios
      .post("http://localhost:8000/api/hang-ve", payload)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_ve: "",
          vi_tri_ngoi: "",
          so_kg_hanh_ly_ky_gui: "",
          so_kg_hanh_ly_xach_tay: "",
          so_do_ghe: "",
          khoang_cach_ghe: "",
          refundable: "false",
          changeable: "false",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 pb-2">
          Danh sách hạng vé
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm hạng vé"}
        </button>
      </div>
      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_hang_ve"
              value={formData.ma_hang_ve}
              onChange={handleChange}
              placeholder="Mã hạng vé"
              className="p-2 border rounded"
            />
            <input
              name="vi_tri_ngoi"
              value={formData.vi_tri_ngoi}
              onChange={handleChange}
              placeholder="Vị trí ngồi"
              className="p-2 border rounded"
            />
            <input
              name="so_kg_hanh_ly_ky_gui"
              value={formData.so_kg_hanh_ly_ky_gui}
              onChange={handleChange}
              placeholder="Số lượng hành lý ký gửi"
              className="p-2 border rounded"
              type="number"
            />
            <input
              name="so_kg_hanh_ly_xach_tay"
              value={formData.so_kg_hanh_ly_xach_tay}
              onChange={handleChange}
              placeholder="Số lượng hành lý xách tay"
              className="p-2 border rounded"
              type="number"
            />
            <input
              name="so_do_ghe"
              value={formData.so_do_ghe}
              onChange={handleChange}
              placeholder="Sơ đồ ghế"
              className="p-2 border rounded"
            />
            <input
              name="khoang_cach_ghe"
              value={formData.khoang_cach_ghe}
              onChange={handleChange}
              placeholder="Khoảng cách ghế"
              className="p-2 border rounded"
            />
            <select
              name="refundable"
              value={formData.refundable}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="true">Có hoàn tiền</option>
              <option value="false">Không hoàn tiền</option>
            </select>
            <select
              name="changeable"
              value={formData.changeable}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="true">Có thay đổi chuyến</option>
              <option value="false">Không thay đổi chuyến</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-500 mt-4 text-green-100 cursor-pointer transition duration-300 ease-in-out px-4 py-2 rounded hover:bg-green-200 hover:text-green-800"
          >
            Xác nhận thêm
          </button>
        </div>
      )}

      {/* bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã hạng vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vị trí ngồi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng hành lý kí gửi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng hành lý xách tay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sơ đồ ghế
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khoảng cách ghế
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoàn tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đổi chuyên bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.ma_hang_ve} className="transition-colors">
                <td className="px-6 py-4">{item.ma_hang_ve}</td>
                <td className="px-6 py-4">{item.vi_tri_ngoi}</td>
                <td className="px-6 py-4">{item.so_kg_hanh_ly_ky_gui}</td>
                <td className="px-6 py-4">{item.so_kg_hanh_ly_xach_tay}</td>
                <td className="px-6 py-4">{item.so_do_ghe}</td>
                <td className="px-6 py-4">{item.khoang_cach_ghe}</td>
                <td className="px-6 py-4">{String(item.refundable)}</td>
                <td className="px-6 py-4">{String(item.changeable)}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hang_ve;
