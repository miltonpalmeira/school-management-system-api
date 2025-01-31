const {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} = require('../controllers/school.controller');
const School = require('../models/School.model');
const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../models/School.model');

let token;
let schoolId;

beforeAll(() => {
  token = jwt.sign(
    { userId: 'superadmin', role: 'superadmin' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  schoolId = new mongoose.Types.ObjectId();
});

describe('School Controller Tests', () => {
  it('should create a new school', async () => {
    const newSchool = {
      name: 'Tech High School',
      address: '123 Tech Street',
      contact: '123-456-7890',
      description: 'A high-tech focused school',
    };

    School.prototype.save = jest.fn().mockResolvedValue({
      _id: schoolId,
      ...newSchool,      
    });

    const req = { body: newSchool };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await createSchool(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tech High School',
        address: '123 Tech Street',
        contact: '123-456-7890',
        description: 'A high-tech focused school',
      })
    );
  });

  it('should fetch all schools', async () => {
    const schools = [
        { _id: new mongoose.Types.ObjectId(), name: 'Tech High School', address: '123 Tech Street' },
        { _id: new mongoose.Types.ObjectId(), name: 'Science Academy', address: '456 Science Ave' },
    ];

    School.find = jest.fn().mockReturnValue(schools);

    const req = mockRequest({
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = mockResponse();
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();

    await getSchools(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(schools);
  });

  it('should return 404 if school not found', async () => {
    const req = mockRequest({
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    School.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getSchoolById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'School not found' });
  });

  it('should update a school by ID', async () => {
    const updatedSchool = {
      name: 'Updated School Name',
      address: 'Updated Address',
      contact: '987-654-3210',
      description: 'Updated school description',
    };

    School.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSchool);

    const req = mockRequest({
      body: updatedSchool,
      params: { id: schoolId.toString() },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateSchool(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedSchool);
  });

  it('should return 404 if school not found during update', async () => {
    const req = mockRequest({
      body: { name: 'Updated School' },
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    School.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateSchool(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'School not found' });
  });

  it('should delete a school by ID', async () => {
    School.findByIdAndDelete = jest.fn().mockResolvedValue({
      message: 'School deleted successfully',
    });

    const req = mockRequest({
      params: { id: schoolId.toString() },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteSchool(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'School deleted successfully',
    });
  });

  it('should return 404 if school not found during deletion', async () => {
    const req = mockRequest({
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    School.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteSchool(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'School not found' });
  });
});
