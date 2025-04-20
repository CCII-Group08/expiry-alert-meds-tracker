
// This file serves as a frontend utility to connect to our MongoDB backend

import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = '/api';

// Medicine API methods
export const MedicineAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medicines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medicine ${id}:`, error);
      throw error;
    }
  },
  
  getByStatus: async (status: 'expired' | 'expiring-soon' | 'safe') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medicines/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medicines with status ${status}:`, error);
      throw error;
    }
  },
  
  getByCategory: async (category: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medicines/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medicines in category ${category}:`, error);
      throw error;
    }
  },
  
  add: async (medicineData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/medicines`, medicineData);
      return response.data;
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw error;
    }
  },
  
  update: async (id: string, medicineData: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/medicines/${id}`, medicineData);
      return response.data;
    } catch (error) {
      console.error(`Error updating medicine ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting medicine ${id}:`, error);
      throw error;
    }
  }
};

// Report API methods
export const ReportAPI = {
  getSummary: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching summary report:', error);
      throw error;
    }
  },
  
  getExpired: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/expired`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expired medicines report:', error);
      throw error;
    }
  },
  
  getExpiringThisWeek: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/expiring-this-week`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicines expiring this week:', error);
      throw error;
    }
  },
  
  getExpiringThisMonth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/expiring-this-month`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicines expiring this month:', error);
      throw error;
    }
  }
};
