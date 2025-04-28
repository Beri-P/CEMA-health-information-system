export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string | null;
  email: string | null;
  createdAt?: string;
  updatedAt?: string;
  Programs?: (Program & { Enrollment: Omit<Enrollment, 'Program'> })[];
}

export interface Program {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  enrollmentId: string;
  clientId: number;
  programId: number;
  status: 'active' | 'completed' | 'withdrawn';
  enrollmentDate: string;
  Program?: Program;
  Client?: Client;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}