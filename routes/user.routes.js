const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const config = require('../config/index.config.js');
const authMiddleware = require('../mws/__auth.mw.js')({ config });
const rbacMiddleware = require('../mws/__rbac.mw.js')(['admin', 'superadmin']);
const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', authMiddleware, rbacMiddleware, getUserById);
router.put('/:id', authMiddleware, rbacMiddleware, updateUser);
router.delete('/:id', authMiddleware, rbacMiddleware, deleteUser);

module.exports = router;
