const request = require('supertest');
const express = require('express');
const { Client } = require('../models');
const clientRoutes = require('../routes/client.routes');

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);

jest.mock('../models', () => ({
  Client: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  }
}));

describe('Client Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/clients', () => {
    it('should return all clients', async () => {
      const mockClients = [
        { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1992-02-02' }
      ];
      Client.findAll.mockResolvedValue(mockClients);

      const response = await request(app).get('/api/clients');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
      expect(Client.findAll).toHaveBeenCalled();
    });

    it('should handle errors when fetching clients', async () => {
      Client.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/clients');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error retrieving clients' });
    });
  });

  describe('POST /api/clients', () => {
    const newClient = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phone: '1234567890',
      email: 'john@example.com'
    };

    it('should create a new client', async () => {
      Client.create.mockResolvedValue({ id: 1, ...newClient });

      const response = await request(app)
        .post('/api/clients')
        .send(newClient);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newClient });
      expect(Client.create).toHaveBeenCalledWith(newClient);
    });

    it('should handle validation errors', async () => {
      const invalidClient = { firstName: '', lastName: '' };
      Client.create.mockRejectedValue({
        name: 'SequelizeValidationError',
        errors: [
          { path: 'firstName', message: 'First name is required' }
        ]
      });

      const response = await request(app)
        .post('/api/clients')
        .send(invalidClient);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error creating client');
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should return a client by ID', async () => {
      const mockClient = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      };
      Client.findByPk.mockResolvedValue(mockClient);

      const response = await request(app).get('/api/clients/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClient);
      expect(Client.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if client is not found', async () => {
      Client.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/clients/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Client not found' });
    });
  });

  describe('PUT /api/clients/:id', () => {
    const updateData = {
      firstName: 'John',
      lastName: 'Updated',
      phone: '0987654321'
    };

    it('should update an existing client', async () => {
      const mockClient = {
        id: 1,
        ...updateData,
        update: jest.fn().mockResolvedValue({ id: 1, ...updateData })
      };
      
      Client.findByPk.mockResolvedValue(mockClient);

      const response = await request(app)
        .put('/api/clients/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(Client.findByPk).toHaveBeenCalledWith('1');
      expect(mockClient.update).toHaveBeenCalledWith(updateData);
    });

    it('should return 404 if client to update is not found', async () => {
      Client.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/clients/999')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Client not found' });
    });

    it('should handle validation errors during update', async () => {
      const mockClient = {
        id: 1,
        update: jest.fn().mockRejectedValue({
          name: 'SequelizeValidationError',
          errors: [
            { path: 'firstName', message: 'First name is required' }
          ]
        })
      };
      
      Client.findByPk.mockResolvedValue(mockClient);

      const response = await request(app)
        .put('/api/clients/1')
        .send({ firstName: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Error updating client');
    });
  });
});