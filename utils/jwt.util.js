const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
};

module.exports = { generateToken };
