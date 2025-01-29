const config = require('../config/index.config.js');
const { authenticate } = require('./__auth.mw.js')({ config });

module.exports = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
        }
        next();
    };
};
