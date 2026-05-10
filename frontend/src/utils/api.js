import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (params) => API.get('/transactions', { params }),
  getOne: (id) => API.get(`/transactions/${id}`),
  create: (data) => API.post('/transactions', data),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
  getSummary: () => API.get('/transactions/summary'),
};

// Report APIs
export const reportAPI = {
  daily: (params) => API.get('/reports/daily', { params }),
  weekly: () => API.get('/reports/weekly'),
  monthly: (params) => API.get('/reports/monthly', { params }),
  categories: (params) => API.get('/reports/categories', { params }),
};

export default API;
