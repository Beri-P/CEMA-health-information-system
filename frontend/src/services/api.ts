import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add request interceptor to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Programs API
export const programsApi = {
  getAll: () => axios.get(`${API_URL}/programs`),
  getById: (id: string) => axios.get(`${API_URL}/programs/${id}`),
  create: (program: any) => axios.post(`${API_URL}/programs`, program),
  update: (id: string, program: any) => axios.put(`${API_URL}/programs/${id}`, program),
  delete: (id: string) => axios.delete(`${API_URL}/programs/${id}`)
};

// Clients API
export const clientsApi = {
  getAll: (searchTerm?: string) => axios.get(`${API_URL}/clients`, { 
    params: { q: searchTerm } 
  }),
  getById: (id: string) => axios.get(`${API_URL}/clients/${id}`),
  create: (client: any) => axios.post(`${API_URL}/clients`, client),
  update: (id: string, client: any) => axios.put(`${API_URL}/clients/${id}`, client),
  delete: (id: string) => axios.delete(`${API_URL}/clients/${id}`),
  getPrograms: (id: string) => axios.get(`${API_URL}/clients/${id}/programs`)
};

// Enrollments API
export const enrollmentsApi = {
  enroll: (clientId: string, programId: string, data: any) => 
    axios.post(`${API_URL}/clients/${clientId}/programs/${programId}`, data),
  unenroll: (clientId: string, programId: string) => 
    axios.delete(`${API_URL}/clients/${clientId}/programs/${programId}`)
};

export default {
  programs: programsApi,
  clients: clientsApi,
  enrollments: enrollmentsApi
};