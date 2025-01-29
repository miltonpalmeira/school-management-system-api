const { authorize } = require('./auth.middleware');

// Protect routes with RBAC
const superadminOnly = authorize(['superadmin']);
const adminOnly = authorize(['admin', 'superadmin']);

module.exports = { superadminOnly, adminOnly };
