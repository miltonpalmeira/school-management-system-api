const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
};
