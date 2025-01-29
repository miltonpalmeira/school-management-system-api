const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const generateJWTToken = async () => {
    const user = await User.create({
        username: 'testuser',
        password: 'password123',
        role: 'superadmin', // Adjust based on role in your RBAC system
    });

    // Generate and return a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

let token;

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_schooldb');
    token = await generateJWTToken();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('School API', () => {
    it('should create a new school', async () => {
        const newSchool = {
            name: 'Test School',
            address: '123 Test St',
            contact: '123-456-7890',
            description: 'Test description for the new school',
        };

        const res = await request(app)
            .post('/api/school')
            .set('Authorization', `Bearer ${token}`)
            .send(newSchool);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'Test School');
    });

    it('should get all schools', async () => {
        const res = await request(app)
            .get('/api/schools')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
