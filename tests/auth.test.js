require('./setup');
const { login } = require('../controllers/auth.controller');
const User = require('../models/user.model');
const { mockResponse, mockRequest } = require('mock-req-res'); 

jest.mock('../models/user.model');

describe('Auth Controller Tests', () => {
  it('should return token when credentials are valid', async () => {
    const mockUser = {
      _id: '12345',
      email: 'superadmin@example.com',
      password: 'password123',
      role: 'superadmin',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const req = mockRequest({
      body: { email: 'superadmin@example.com', password: 'password123' },
    });
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });

  it('should return 400 if credentials are invalid', async () => {
    const req = mockRequest({
      body: { email: 'wrongemail', password: 'wrongpassword' },
    });
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });
});
