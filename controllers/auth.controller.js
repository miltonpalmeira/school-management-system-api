const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt.util');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management API
 */

/**
 * @swagger
 * /api/auth/:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: 
 *      - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Successful authentication, returns JWT token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};
