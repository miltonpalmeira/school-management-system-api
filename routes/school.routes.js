const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/school.controller');
const authMiddleware = require('../mws/__auth.mw.js')({});
const rbacMiddleware = require('../mws/__rbac.mw.js')({});

// Protected routes for superadmins
router.post('/school', authMiddleware, rbacMiddleware, schoolController.createSchool);
router.get('/schools', authMiddleware, rbacMiddleware, schoolController.getSchools);
router.get('/school/:id', authMiddleware, rbacMiddleware, schoolController.getSchoolById);
router.put('/school/:id', authMiddleware, rbacMiddleware, schoolController.updateSchool);
router.delete('/school/:id', authMiddleware, rbacMiddleware, schoolController.deleteSchool);

module.exports = router;
