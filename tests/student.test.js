const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
config();

describe('Student Controller', () => {
    let token;
    let schoolId;
    let classroomId;

    beforeAll(async () => {
        const School = require('../models/School.model');
        const Classroom = require('../models/Classroom.model');
        
        const school = new School({ name: 'Test School' });
        const classroom = new Classroom({ name: 'Classroom 1', school: school._id, capacity: 30 });
        await school.save();
        await classroom.save();

        schoolId = school._id;
        classroomId = classroom._id;

        token = jwt.sign({ userId: 'superadmin', role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should create a student without a school or classroom', async () => {
        const res = await request(app)
            .post('/students')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'John', lastName: 'Doe' });

        expect(res.statusCode).toBe(201);
        expect(res.body.firstName).toBe('John');
        expect(res.body.lastName).toBe('Doe');
        expect(res.body.school).toBeUndefined();
        expect(res.body.classroom).toBeUndefined();
    });

    it('should create a student with a school and classroom', async () => {
        const res = await request(app)
            .post('/students')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Jane', lastName: 'Doe', school: schoolId, classroom: classroomId });

        expect(res.statusCode).toBe(201);
        expect(res.body.firstName).toBe('Jane');
        expect(res.body.school).toBe(schoolId.toString());
        expect(res.body.classroom).toBe(classroomId.toString());
    });

    it('should get a student by ID', async () => {
        const student = await request(app)
            .post('/students')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Sam', lastName: 'Smith', school: schoolId, classroom: classroomId });

        const res = await request(app)
            .get(`/students/${student.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe('Sam');
        expect(res.body.lastName).toBe('Smith');
    });

    it('should update a student', async () => {
        const student = await request(app)
            .post('/students')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Alex', lastName: 'Johnson', school: schoolId, classroom: classroomId });

        const newClassroom = new Classroom({ name: 'Classroom 2', school: schoolId, capacity: 25 });
        await newClassroom.save();

        const res = await request(app)
            .put(`/students/${student.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ classroom: newClassroom._id });

        expect(res.statusCode).toBe(200);
        expect(res.body.classroom).toBe(newClassroom._id.toString());
    });

    it('should delete a student', async () => {
        const student = await request(app)
            .post('/students')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Tom', lastName: 'Jones', school: schoolId, classroom: classroomId });

        const res = await request(app)
            .delete(`/students/${student.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Student deleted successfully');
    });
});
