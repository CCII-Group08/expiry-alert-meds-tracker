
/**
 * API service for communicating with the backend
 */

const API = {
  baseUrl: '/api',
  
  // Helper method for API calls
  async fetchApi(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // For non-GET requests with no content, return success indicator
      if (response.status === 204) {
        return { success: true };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Medicine API methods
  medicines: {
    getAll: async () => API.fetchApi('/medicines'),
    
    getById: async (id) => API.fetchApi(`/medicines/${id}`),
    
    getByStatus: async (status) => API.fetchApi(`/medicines/status/${status}`),
    
    getByCategory: async (category) => API.fetchApi(`/medicines/category/${category}`),
    
    getByBarcode: async (barcode) => API.fetchApi(`/medicines/barcode/${barcode}`),
    
    add: async (medicineData) => API.fetchApi('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData)
    }),
    
    update: async (id, medicineData) => API.fetchApi(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicineData)
    }),
    
    delete: async (id) => API.fetchApi(`/medicines/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Report API methods
  reports: {
    getSummary: async () => API.fetchApi('/reports/summary'),
    
    getExpired: async () => API.fetchApi('/reports/expired'),
    
    getExpiringThisWeek: async () => API.fetchApi('/reports/expiring-this-week'),
    
    getExpiringThisMonth: async () => API.fetchApi('/reports/expiring-this-month'),
    
    downloadCsv: (filters = {}) => {
      const params = new URLSearchParams(filters);
      window.location.href = `${API.baseUrl}/reports/download/csv?${params}`;
      return true;
    },
    
    downloadPdf: (filters = {}) => {
      const params = new URLSearchParams(filters);
      window.location.href = `${API.baseUrl}/reports/download/pdf?${params}`;
      return true;
    }
  }
};
