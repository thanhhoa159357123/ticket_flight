import { useState, useEffect } from 'react';
import { veService } from '../../services/veService';

export const useVeData = () => {
  const [veData, setVeData] = useState([]);
  const [hangVeData, setHangVeData] = useState([]);
  const [chuyenBayData, setChuyenBayData] = useState([]);
  const [hangBanVeData, setHangBanVeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 FIX: Sửa logic remove duplicates
  const removeDuplicates = (data) => {
    if (!Array.isArray(data)) {
      console.warn('⚠️ Data không phải array:', data);
      return [];
    }

    // 🔥 Kiểm tra field nào có trong data để remove duplicates
    const firstItem = data[0];
    if (!firstItem) return data;

    console.log('🔍 Sample item:', firstItem);
    console.log('🔍 Available fields:', Object.keys(firstItem));

    // Determine unique field based on actual data structure
    let uniqueField = 'ma_ve'; // Default
    if (firstItem.ma_gia_ve) {
      uniqueField = 'ma_gia_ve';
    } else if (firstItem._id) {
      uniqueField = '_id';
    } else if (firstItem.id) {
      uniqueField = 'id';
    }

    console.log(`🎯 Using unique field: ${uniqueField}`);

    const uniqueData = data.filter((item, index, self) =>
      index === self.findIndex(t => t[uniqueField] === item[uniqueField])
    );

    console.log(`📊 Original: ${data.length}, Unique: ${uniqueData.length}, Removed: ${data.length - uniqueData.length}`);
    
    return uniqueData;
  };

  const fetchVeData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching vé data...');
      const data = await veService.getAllVe();
      
      console.log('✅ Raw API response:', {
        type: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        sample: data?.slice(0, 2)
      });
      
      if (!data) {
        console.warn('⚠️ API returned null/undefined');
        setVeData([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ API response is not an array:', data);
        setVeData([]);
        setError('❌ Dữ liệu trả về không đúng định dạng');
        return;
      }

      const uniqueData = removeDuplicates(data);
      setVeData(uniqueData);
      
      console.log('✅ Successfully loaded vé data:', {
        total: data.length,
        unique: uniqueData.length,
        duplicatesRemoved: data.length - uniqueData.length
      });
      
    } catch (err) {
      console.error('❌ fetchVeData error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(`❌ Lỗi khi tải danh sách vé: ${err.message}`);
      setVeData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHangVeData = async () => {
    try {
      console.log('🔄 Fetching hạng vé data...');
      const data = await veService.getAllHangVe();
      console.log('✅ Hạng vé loaded:', data?.length, 'items');
      setHangVeData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ fetchHangVeData error:', err);
      setError('❌ Lỗi khi tải danh sách hạng vé');
      setHangVeData([]);
    }
  };

  const fetchChuyenBayData = async () => {
    try {
      console.log('🔄 Fetching chuyến bay data...');
      const data = await veService.getAllChuyenBay();
      console.log('✅ Chuyến bay loaded:', data?.length, 'items');
      setChuyenBayData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ fetchChuyenBayData error:', err);
      setError('❌ Lỗi khi tải danh sách chuyến bay');
      setChuyenBayData([]);
    }
  };

  const fetchHangBanVeData = async () => {
    try {
      console.log('🔄 Fetching hãng bán vé data...');
      const data = await veService.getAllHangBanVe();
      console.log('✅ Hãng bán vé loaded:', data?.length, 'items');
      setHangBanVeData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ fetchHangBanVeData error:', err);
      setError('❌ Lỗi khi tải danh sách hãng bán vé');
      setHangBanVeData([]);
    }
  };

  const refreshAllData = async () => {
    console.log('🔄 Refreshing all data...');
    setLoading(true);
    
    try {
      await Promise.all([
        fetchVeData(),
        fetchHangVeData(),
        fetchChuyenBayData(),
        fetchHangBanVeData(),
      ]);
      console.log('✅ All data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing all data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useVeData initialized - loading data...');
    refreshAllData();
  }, []);

  return {
    veData,
    hangVeData,
    chuyenBayData,
    hangBanVeData,
    loading,
    error,
    refreshVeData: fetchVeData,
    refreshAllData,
  };
};