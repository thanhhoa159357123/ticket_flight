import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// 🔥 Add request/response interceptors for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, {
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      length: response.data?.length
    });
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const veService = {
  // Get all tickets với error handling
  getAllVe: async () => {
    try {
      console.log('🔍 Calling GET /ve endpoint...');
      const response = await axios.get(`${API_BASE_URL}/ve`);
      
      console.log('✅ getAllVe response:', {
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        length: response.data?.length,
        sample: response.data?.slice(0, 2)
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ getAllVe failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Create new ticket
  createVe: async (data) => {
    try {
      console.log('🔍 Creating vé:', data);
      const response = await axios.post(`${API_BASE_URL}/ve`, data);
      console.log('✅ Vé created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ createVe failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update ticket
  updateVe: async (id, data) => {
    try {
      console.log('🔍 Updating vé:', id, data);
      const response = await axios.put(`${API_BASE_URL}/ve/${id}`, data);
      console.log('✅ Vé updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ updateVe failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete ticket
  deleteVe: async (id) => {
    try {
      console.log('🔍 Deleting vé:', id);
      const response = await axios.delete(`${API_BASE_URL}/ve/${id}`);
      console.log('✅ Vé deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ deleteVe failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Import Excel
  importExcel: async (file) => {
    try {
      console.log('🔍 Importing Excel file:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_BASE_URL}/ve/import-excel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 seconds timeout for file upload
        }
      );
      console.log('✅ Excel imported successfully');
      return response.data;
    } catch (error) {
      console.error('❌ importExcel failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get hang ve
  getAllHangVe: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hangve`);
      return response.data;
    } catch (error) {
      console.error('❌ getAllHangVe failed:', error);
      throw error;
    }
  },

  // Get chuyen bay  
  getAllChuyenBay: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chuyenbay`);
      return response.data;
    } catch (error) {
      console.error('❌ getAllChuyenBay failed:', error);
      throw error;
    }
  },

  // Get hang ban ve
  getAllHangBanVe: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hangbanve`);
      return response.data;
    } catch (error) {
      console.error('❌ getAllHangBanVe failed:', error);
      throw error;
    }
  },
};