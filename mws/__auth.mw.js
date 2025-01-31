const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = ({ config }) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }        
        const tokenWithoutBearer = token.split(' ')[1]; 
        try {
            const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(400).json({ message: 'Invalid token.', error: err.message });
        }
    };
};
