const mongoose = require('mongoose');
const { config } = require('dotenv');
config();

beforeAll(async () => {
    const dbUrl = process.env.TEST_DB_URL || 'mongodb://localhost:27017/test_schooldb';
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});
