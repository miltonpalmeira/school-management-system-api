const {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollStudent,
} = require('../controllers/student.controller');

const Student = require('../models/Student.model');
const School = require('../models/School.model');
const Classroom = require('../models/Classroom.model');
const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../models/Student.model');
jest.mock('../models/School.model');
jest.mock('../models/Classroom.model');

let token;
let schoolId;
let classroomId;
let studentId;

beforeAll(async () => {
  schoolId = new mongoose.Types.ObjectId();
  classroomId = new mongoose.Types.ObjectId();
  studentId = new mongoose.Types.ObjectId();

  School.findById = jest.fn().mockResolvedValue({
    _id: schoolId,
    name: 'Test School',
  });

  Classroom.findById = jest.fn().mockResolvedValue({
    _id: classroomId,
    name: 'Backend 101',
    school: schoolId,
  });

  token = jwt.sign(
    { userId: 'superadmin', role: 'superadmin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

describe('Student Controller Tests', () => {
  it('should create a new student', async () => {
    const newStudent = {
      firstName: 'John',
      lastName: 'Doe',
      school: schoolId,
      classroom: classroomId,
    };

    Student.prototype.save = jest.fn().mockResolvedValue({
      ...newStudent,
      _id: studentId,
    });

    const req = { body: newStudent };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        school: schoolId,
        classroom: classroomId,
      })
    );
  });

  it('should return 404 if school not found when creating student', async () => {
    School.findById = jest.fn().mockResolvedValue(null);

    const req = {
      body: {
        firstName: 'Jane',
        lastName: 'Doe',
        school: 'invalidID',
        classroom: classroomId,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'School not found' });
  });

  it('should fetch a student by ID', async () => {
    const student = {
      _id: studentId,
      firstName: 'John',
      lastName: 'Doe',
      school: schoolId,
      classroom: classroomId,
    };

    Student.findById = jest.fn().mockResolvedValue(student);

    const req = mockRequest({ params: { id: studentId.toString() } });
    const res = mockResponse();
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();

    await getStudentById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(student);
  });

  it('should return 404 if student not found', async () => {
    Student.findById = jest.fn().mockResolvedValue(null);

    const req = mockRequest({ params: { id: 'invalidID' } });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getStudentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
  });

  it('should update a student by ID', async () => {
    const updatedStudent = {
      firstName: 'John',
      lastName: 'Smith',
      school: schoolId,
      classroom: classroomId,
    };

    Student.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedStudent);

    const req = mockRequest({
      body: updatedStudent,
      params: { id: studentId.toString() },
    });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedStudent);
  });

  it('should return 404 if student not found during update', async () => {
    Student.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = mockRequest({
      body: { firstName: 'Updated' },
      params: { id: 'invalidID' },
    });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
  });

  it('should delete a student by ID', async () => {
    Student.findByIdAndDelete = jest.fn().mockResolvedValue({
      message: 'Student deleted successfully',
    });

    const req = mockRequest({ params: { id: studentId.toString() } });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Student deleted successfully',
    });
  });

  it('should return 404 if student not found during deletion', async () => {
    Student.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const req = mockRequest({ params: { id: 'invalidID' } });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
  });

  it.skip('should enroll a student in a school and classroom', async () => {
    const enrollment = {
      school: schoolId,
      classroom: classroomId,
    };

    Student.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          _id: studentId,
          ...enrollment,
        }),
    }));

    const req = { body: enrollment };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await enrollStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(enrollment));
  });
});
