const request = require('supertest');
const express = require('express');
const { Enrollment, Program } = require('../models');
const enrollmentRoutes = require('../routes/enrollment.routes');

const app = express();
app.use(express.json());
app.use('/api/enrollments', enrollmentRoutes);

jest.mock('../models', () => ({
  Enrollment: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Program: {
    findAll: jest.fn()
  }
}));

describe('Enrollment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/enrollments', () => {
    const newEnrollment = {
      clientId: 1,
      programId: 1,
      status: 'active'
    };

    it('should create a new enrollment', async () => {
      const mockEnrollment = {
        id: 1,
        ...newEnrollment,
        enrollmentDate: new Date().toISOString()
      };
      
      Enrollment.create.mockResolvedValue(mockEnrollment);

      const response = await request(app)
        .post('/api/enrollments')
        .send(newEnrollment);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEnrollment);
      expect(Enrollment.create).toHaveBeenCalledWith(expect.objectContaining({
        clientId: 1,
        programId: 1,
        status: 'active'
      }));
    });

    it('should handle validation errors', async () => {
      Enrollment.create.mockRejectedValue({
        name: 'SequelizeValidationError',
        errors: [
          { path: 'clientId', message: 'Client ID is required' }
        ]
      });

      const response = await request(app)
        .post('/api/enrollments')
        .send({ programId: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error creating enrollment');
    });

    it('should handle duplicate enrollments', async () => {
      Enrollment.create.mockRejectedValue({
        name: 'SequelizeUniqueConstraintError',
        errors: [
          { path: 'enrollment', message: 'Client is already enrolled in this program' }
        ]
      });

      const response = await request(app)
        .post('/api/enrollments')
        .send(newEnrollment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error creating enrollment');
    });
  });

  describe('GET /api/enrollments/client/:clientId', () => {
    it('should return all enrollments for a client', async () => {
      const clientId = 1;
      const mockEnrollments = [
        { 
          id: 1, 
          clientId, 
          programId: 1, 
          status: 'active',
          Program: { id: 1, name: 'TB Program' }
        },
        { 
          id: 2, 
          clientId, 
          programId: 2, 
          status: 'active',
          Program: { id: 2, name: 'Malaria Program' }
        }
      ];
      
      Enrollment.findAll.mockResolvedValue(mockEnrollments);

      const response = await request(app)
        .get(`/api/enrollments/client/${clientId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEnrollments);
      expect(Enrollment.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clientId },
          include: [Program]
        })
      );
    });

    it('should handle errors when fetching enrollments', async () => {
      Enrollment.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/enrollments/client/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error retrieving enrollments' });
    });
  });

  describe('PUT /api/enrollments/:id/status', () => {
    it('should update enrollment status', async () => {
      const enrollmentId = 1;
      const newStatus = 'completed';
      
      const mockEnrollment = {
        id: enrollmentId,
        clientId: 1,
        programId: 1,
        status: 'active',
        update: jest.fn().mockResolvedValue({
          id: enrollmentId,
          status: newStatus
        })
      };
      
      Enrollment.findByPk.mockResolvedValue(mockEnrollment);

      const response = await request(app)
        .put(`/api/enrollments/${enrollmentId}/status`)
        .send({ status: newStatus });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', newStatus);
      expect(Enrollment.findByPk).toHaveBeenCalledWith(enrollmentId);
      expect(mockEnrollment.update).toHaveBeenCalledWith({ status: newStatus });
    });

    it('should return 404 if enrollment is not found', async () => {
      Enrollment.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/enrollments/999/status')
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Enrollment not found' });
    });

    it('should handle invalid status values', async () => {
      const mockEnrollment = {
        id: 1,
        update: jest.fn().mockRejectedValue({
          name: 'SequelizeValidationError',
          errors: [
            { path: 'status', message: 'Invalid status value' }
          ]
        })
      };
      
      Enrollment.findByPk.mockResolvedValue(mockEnrollment);

      const response = await request(app)
        .put('/api/enrollments/1/status')
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error updating enrollment status');
    });
  });
});