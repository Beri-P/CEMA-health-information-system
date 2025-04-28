const request = require('supertest');
const express = require('express');
const { Program } = require('../models');
const programRoutes = require('../routes/program.routes');

const app = express();
app.use(express.json());
app.use('/api/programs', programRoutes);

jest.mock('../models', () => ({
  Program: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  }
}));

describe('Program Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/programs', () => {
    it('should return all programs', async () => {
      const mockPrograms = [
        { id: 1, name: 'TB Program', description: 'Tuberculosis Treatment Program' },
        { id: 2, name: 'Malaria Program', description: 'Malaria Prevention Program' }
      ];
      Program.findAll.mockResolvedValue(mockPrograms);

      const response = await request(app).get('/api/programs');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPrograms);
      expect(Program.findAll).toHaveBeenCalled();
    });

    it('should handle database errors when fetching programs', async () => {
      Program.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/programs');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error retrieving programs' });
    });
  });

  describe('POST /api/programs', () => {
    const newProgram = {
      name: 'HIV Program',
      description: 'HIV Treatment and Prevention Program'
    };

    it('should create a new program', async () => {
      Program.create.mockResolvedValue({ id: 1, ...newProgram });

      const response = await request(app)
        .post('/api/programs')
        .send(newProgram);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newProgram });
      expect(Program.create).toHaveBeenCalledWith(newProgram);
    });

    it('should handle validation errors', async () => {
      const invalidProgram = { name: '', description: '' };
      Program.create.mockRejectedValue({
        name: 'SequelizeValidationError',
        errors: [
          { path: 'name', message: 'Program name is required' }
        ]
      });

      const response = await request(app)
        .post('/api/programs')
        .send(invalidProgram);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error creating program');
    });

    it('should handle duplicate program names', async () => {
      Program.create.mockRejectedValue({
        name: 'SequelizeUniqueConstraintError',
        errors: [
          { path: 'name', message: 'Program name must be unique' }
        ]
      });

      const response = await request(app)
        .post('/api/programs')
        .send(newProgram);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error creating program');
    });
  });

  describe('GET /api/programs/:id', () => {
    it('should return a program by ID', async () => {
      const mockProgram = {
        id: 1,
        name: 'TB Program',
        description: 'Tuberculosis Treatment Program'
      };
      Program.findByPk.mockResolvedValue(mockProgram);

      const response = await request(app).get('/api/programs/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProgram);
      expect(Program.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if program is not found', async () => {
      Program.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/programs/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Program not found' });
    });

    it('should handle database errors when fetching a program', async () => {
      Program.findByPk.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/programs/1');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error retrieving program' });
    });
  });
});