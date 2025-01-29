const request = require('supertest');
const app = require('../app');

let token;

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/schooldb');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Classroom API', () => {
    it('should create a new classroom', async () => {
        const newClassroom = {
            name: 'Math 101',
            school: 'schoolId',
            capacity: 30,
            resources: ['projector', 'whiteboard'],
        };

        const res = await request(app)
            .post('/api/classroom')
            .set('Authorization', `Bearer ${token}`)
            .send(newClassroom);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'Math 101');
    });
});
