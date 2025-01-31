const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const config = require('../config/index.config.js');
const authMiddleware = require('../mws/__auth.mw.js')({ config });
const rbacMiddleware = require('../mws/__rbac.mw.js')(['admin', 'superadmin']);

router.post('/enroll', authMiddleware, rbacMiddleware, studentController.enrollStudent);
router.put('/transfer/:id', authMiddleware, rbacMiddleware, studentController.transferStudent);
router.post('/', authMiddleware, rbacMiddleware, studentController.createStudent);
router.get('/:id', authMiddleware, studentController.getStudentById);
router.put('/:id', authMiddleware, rbacMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, rbacMiddleware, studentController.deleteStudent);
router.get('/school/:id', authMiddleware, studentController.getStudentsBySchool);

module.exports = router;
