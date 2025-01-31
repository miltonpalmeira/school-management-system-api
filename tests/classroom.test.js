const {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroom.controller');
const Classroom = require('../models/Classroom.model');
const School = require('../models/School.model');
const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../models/Classroom.model');
jest.mock('../models/School.model');

let token;
let schoolId;

beforeAll(async () => {
  School.findById = jest.fn().mockResolvedValue({
    _id: new mongoose.Types.ObjectId(),
    name: 'Test School',
  });
  const school = new School({ name: 'Test School' });
  await school.save();
  schoolId = school._id;

  token = jwt.sign(
    { userId: 'superadmin', role: 'superadmin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

describe('Classroom Controller Tests', () => {
  it('should create a new classroom', async () => {
    const newClassroom = {
      name: 'Backend 001',
      school: schoolId,
      capacity: 30,
      resources: ['projector', 'whiteboard', 'computer'],
    };

    Classroom.prototype.save = jest.fn().mockResolvedValue({
      ...newClassroom,
      _id: new mongoose.Types.ObjectId(),
    });

    const req = { body: newClassroom };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createClassroom(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Backend 001',
        school: schoolId,
        capacity: 30,
        resources: expect.arrayContaining([
          'projector',
          'whiteboard',
          'computer',
        ]),
      })
    );
  });

  it('should fetch all classrooms', async () => {
    const classrooms = [{ name: 'Backend 001' }, { name: 'Frontend 101' }];
    Classroom.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(classrooms),
    });

    const req = mockRequest({
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = mockResponse();
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();

    await getClassrooms(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(classrooms);
  });

  it('should return 404 if classroom not found', async () => {
    const req = mockRequest({
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Classroom.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
    });

    await getClassroomById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Classroom not found' });
  });

  it('should update a classroom by ID', async () => {
    const updatedClassroom = {
      name: 'Backend 101',
      school: schoolId,
      capacity: 35,
      resources: ['projector', 'whiteboard'],
    };

    const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(updatedClassroom);
    Classroom.findByIdAndUpdate = mockFindByIdAndUpdate;

    const req = mockRequest({
      body: updatedClassroom,
      params: { id: 'classroomId' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await updateClassroom(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedClassroom);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'classroomId',
      updatedClassroom,
      { new: true }
    );
  });

  it('should return 404 if classroom not found during update', async () => {
    const req = mockRequest({
      body: { name: 'Updated Classroom' },
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    Classroom.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateClassroom(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Classroom not found' });
  });

  it('should delete a classroom by ID', async () => {
    const mockFindByIdAndDelete = jest
      .fn()
      .mockResolvedValue({ message: 'Classroom deleted successfully' });
    Classroom.findByIdAndDelete = mockFindByIdAndDelete;

    const req = mockRequest({
      params: { id: 'classroomId' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await deleteClassroom(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Classroom deleted successfully',
    });
    expect(mockFindByIdAndDelete).toHaveBeenCalledWith('classroomId');
  });

  it('should return 404 if classroom not found during deletion', async () => {
    const req = mockRequest({
      params: { id: 'invalidID' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    Classroom.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteClassroom(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Classroom not found' });
  });
});
