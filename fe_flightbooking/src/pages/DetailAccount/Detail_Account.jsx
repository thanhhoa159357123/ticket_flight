// Detail_Account.js
import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import styles from "./DetailAccount.module.scss";
import Item_Information from "./ItemInformation/Item_Information";
import Item_History_Ticket from "./ItemHistoryTicket/Item_History_Ticket";
import Edit_Information from "../../components/editinformation/Edit_Information";

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
    const currentEmail = user.email; // lưu lại email hiện tại
    try {
      const res = await fetch(
        "http://localhost:8000/auth/update-info?current_email=" + currentEmail,
        {
          method: "POST",
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
        className={`${styles.detailAccount} ${
          showModal ? styles.blurEffect : ""
        }`}
      >
        <div className={styles.itemAccount}>
          {["Thông tin cá nhân", "Lịch sử đặt vé"].map((name, i) => (
            <span
              key={i}
              className={`${styles.itemsLink} ${
                activeTab === name ? styles.active : ""
              }`}
              onClick={() => setActiveTab(name)}
            >
              {name}
            </span>
          ))}
        </div>

        <div className={styles.contentArea}>
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
