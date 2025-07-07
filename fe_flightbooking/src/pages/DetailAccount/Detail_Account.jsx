import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Item_Information from "./Item_Information";
import Item_History_Ticket from "./Item_History_Ticket";
import Edit_Information from "../../components/Edit_Information";

const FIELD_LABELS = {
  ten_khach_hang: "Họ tên",
  email: "Email",
  so_dien_thoai: "Số điện thoại",
  matkhau: "Mật khẩu",
};

const Detail_Account = () => {
  const [activeTab, setActiveTab] = useState("Thông tin cá nhân");
  const [showModal, setShowModal] = useState(false);
  const [fieldEditing, setFieldEditing] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleEdit = (field) => {
    setFieldEditing(field);
    setShowModal(true);
  };

  const handleSave = async (newValue) => {
    const currentEmail = user.email;
    try {
      const res = await fetch(
        "http://localhost:8000/auth/update-info?current_email=" + currentEmail,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [fieldEditing]: newValue }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const newUser = { ...user, [fieldEditing]: newValue };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setShowModal(false);
      setFieldEditing(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFieldEditing(null);
  };

  return (
    <>
      <Navbar />
      <div
        className={`bg-[#f8fafc] min-h-[calc(100vh-80px)] px-8 py-5 transition-all duration-300 ease-in-out font-sans relative ${
          showModal ? "filter pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex flex-wrap gap-4 mb-8 border-b border-[#e2e8f0] pb-4 max-w-[1500px] mx-auto px-4">
          {["Thông tin cá nhân", "Lịch sử đặt vé"].map((name, i) => (
            <span
              key={i}
              onClick={() => setActiveTab(name)}
              className={`relative px-6 py-3 cursor-pointer font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:text-blue-600
    ${activeTab === name ? "text-blue-600" : "text-slate-500"}
  `}
            >
              {name}
              <span
                className={`absolute left-1/2 bottom-0 h-[3px] bg-blue-600 rounded-t-md transition-transform duration-300 ease-in-out
      ${
        activeTab === name
          ? "w-[80%] -translate-x-1/2 scale-x-100 origin-center"
          : "w-[80%] -translate-x-1/2 scale-x-0 origin-center"
      }
    `}
              />
            </span>
          ))}
        </div>

        <div className="w-full max-w-[1500px] mx-auto p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
          {activeTab === "Thông tin cá nhân" ? (
            <Item_Information user={user} onEditField={handleEdit} />
          ) : (
            <Item_History_Ticket />
          )}
        </div>
      </div>

      {showModal && (
        <Edit_Information
          fieldLabel={FIELD_LABELS[fieldEditing]}
          currentValue={user[fieldEditing]}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default Detail_Account;
