import { useState, useRef } from 'react';
import { veService } from '../../services/veService';

export const useVeForm = (onSuccess) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_ve: '',
    gia_ve: '',
    ma_hang_ve: '',
    ma_chuyen_bay: '',
    ma_hang_ban_ve: '',
  });

  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFormData({
      ma_ve: '',
      gia_ve: '',
      ma_hang_ve: '',
      ma_chuyen_bay: '',
      ma_hang_ban_ve: '',
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const { ma_ve, gia_ve, ma_hang_ve, ma_chuyen_bay, ma_hang_ban_ve } = formData;
    
    if (!ma_ve || !gia_ve || !ma_hang_ve || !ma_chuyen_bay || !ma_hang_ban_ve) {
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    await veService.createVe(formData);
    resetForm();
    setShowForm(false);
    onSuccess?.();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImportExcel(file);
    }
  };

  const handleImportExcel = async (file) => {
    if (!file) {
      throw new Error('Vui lòng chọn file Excel');
    }

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      throw new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)');
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await veService.importExcel(file);
      setImportResult(result);
      onSuccess?.();
      return result;
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return {
    showForm,
    setShowForm,
    formData,
    setFormData,
    importing,
    importResult,
    fileInputRef,
    handleChange,
    handleAdd,
    handleFileSelect,
    handleImportExcel,
    resetForm,
  };
};