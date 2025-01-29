const jwt = require('jsonwebtoken');

module.exports = ({ config }) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        try {
            const decoded = jwt.verify(token, config.dotEnv.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    };
};
