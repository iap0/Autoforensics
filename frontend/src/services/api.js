import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes timeout for analysis
});

// API service object
const api = {
  /**
   * Health check endpoint
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Upload file for analysis
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Analyze file for Sybil attack
   */
  analyzeSybilAttack: async (filename, originalFilename) => {
    try {
      const response = await apiClient.post('/analyze/sybil', {
        filename,
        // original_filename: originalFilename,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Analyze file for Position Falsification
   */
  analyzePositionFalsification: async (filename, originalFilename) => {
    try {
      const response = await apiClient.post('/analyze/position', {
        filename,
        // original_filename: originalFilename,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Download PDF report
   */
  downloadPDFReport: async (reportData, reportType) => {
    try {
      const response = await apiClient.post(
        `/download/pdf/${reportType}`,
        { report: reportData },
        {
          responseType: 'blob',
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Autoforensics_${reportType}_Report_${new Date().getTime()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Clean up uploaded file
   */
  cleanupFile: async (filename) => {
    try {
      const response = await apiClient.delete(`/cleanup/${filename}`);
      return response.data;
    } catch (error) {
      // Don't throw error for cleanup failures
      console.error('Cleanup failed:', error);
      return null;
    }
  },
};

export default api;