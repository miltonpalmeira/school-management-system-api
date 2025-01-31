const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroom.controller');
const config = require('../config/index.config.js');
const authMiddleware = require('../mws/__auth.mw.js')({ config });
const rbacMiddleware = require('../mws/__rbac.mw.js')(['admin', 'superadmin']);

router.post('/', authMiddleware, rbacMiddleware, classroomController.createClassroom);
router.get('/', authMiddleware, rbacMiddleware, classroomController.getClassrooms);
router.get('/:id', authMiddleware, rbacMiddleware, classroomController.getClassroomById);
router.put('/:id', authMiddleware, rbacMiddleware, classroomController.updateClassroom);
router.delete('/:id', authMiddleware, rbacMiddleware, classroomController.deleteClassroom);
router.get('/test', (req, res) => { console.log(reached); res.status(200).json({ message: 'Classrooms API is working' }); })
module.exports = router;
