import axios from 'axios';
import { Client, Program, Enrollment } from '../types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Client API calls
export const getClients = () => 
  api.get<Client[]>('/clients');

export const getClient = (id: number) => 
  api.get<Client>(`/clients/${id}`);

export const createClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => 
  api.post<Client>('/clients', data);

export const updateClient = (id: number, data: Partial<Client>) => 
  api.put<Client>(`/clients/${id}`, data);

// Program API calls
export const getPrograms = () => 
  api.get<Program[]>('/programs');

export const getProgram = (id: number) => 
  api.get<Program>(`/programs/${id}`);

export const createProgram = (data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => 
  api.post<Program>('/programs', data);

// Enrollment API calls
export const createEnrollment = (data: { 
  clientId: number; 
  programId: number; 
  status?: 'active' | 'completed' | 'withdrawn' 
}) => api.post<Enrollment>('/enrollments', data);

export const getClientEnrollments = (clientId: number) => 
  api.get<Enrollment[]>(`/enrollments/client/${clientId}`);

export const updateEnrollmentStatus = (id: number, status: Enrollment['status']) => 
  api.put<Enrollment>(`/enrollments/${id}/status`, { status });

export default api;