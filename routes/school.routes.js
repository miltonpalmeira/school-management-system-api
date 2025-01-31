const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/school.controller');
const config = require('../config/index.config.js');
const authMiddleware = require('../mws/__auth.mw.js')({ config });
const rbacMiddleware = require('../mws/__rbac.mw.js')(['admin', 'superadmin']);

router.post('/', authMiddleware, rbacMiddleware, schoolController.createSchool);
router.get('/', authMiddleware, rbacMiddleware, schoolController.getSchools);
router.get('/:id', authMiddleware, rbacMiddleware, schoolController.getSchoolById);
router.put('/:id', authMiddleware, rbacMiddleware, schoolController.updateSchool);
router.delete('/:id', authMiddleware, rbacMiddleware, schoolController.deleteSchool);

module.exports = router;
