const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
config();

describe('Authorization Middleware', () => {
    let token;

    beforeAll(() => {
        token = jwt.sign({ userId: 'testUser', role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should allow access with valid token', async () => {
        const res = await request(app)
            .get('/students')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it('should deny access without token', async () => {
        const res = await request(app)
            .get('/students');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('should deny access with invalid token', async () => {
        const res = await request(app)
            .get('/students')
            .set('Authorization', 'Bearer invalidToken');

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid token.');
    });
});
