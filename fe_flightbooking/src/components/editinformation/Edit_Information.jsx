import React, { useState } from "react";
import styles from "./EditInformation.module.scss";

const Edit_Information = ({ fieldLabel, currentValue, onSave, onCancel }) => {
  const [value, setValue] = useState(currentValue || "");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Chỉnh sửa {fieldLabel}</h3>
        <input 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className={styles.inputField}
        />
        <div className={styles.actions}>
          <button 
            onClick={() => onSave(value)}
            className={styles.saveButton}
          >
            Đồng ý
          </button>
          <button 
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_Information;