const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../mws/__auth.mw.js')({});
const rbacMiddleware = require('../mws/__rbac.mw.js')({});

router.post('/student/enroll', authMiddleware, rbacMiddleware, studentController.enrollStudent);
router.put('/student/transfer/:id', authMiddleware, rbacMiddleware, studentController.transferStudent);
router.post('/', authenticate, adminOnly, createStudent);
router.get('/:id', authenticate, getStudentById);
router.put('/:id', authenticate, adminOnly, updateStudent);
router.delete('/:id', authenticate, adminOnly, deleteStudent);

module.exports = router;
