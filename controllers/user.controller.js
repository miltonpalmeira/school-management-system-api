const User = require('../models/User.model');

// Route to create a new user
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john_doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *               role:
 *                 type: string
 *                 enum: [superadmin, admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Route to get all users
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (only accessible by superadmin)
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden (only accessible by superadmin)
 *       500:
 *         description: Internal server error
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Route to get a user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Route to update a user
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john_doe_updated@example.com
 *               role:
 *                 type: string
 *                 enum: [superadmin, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Route to delete a user
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (only accessible by superadmin)
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};
