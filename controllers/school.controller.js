const School = require('../models/School.model');

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: School management API
 */

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     tags: 
 *       - Schools
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - contact
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech High School"
 *               address:
 *                 type: string
 *                 example: "123 Tech Street"
 *               contact:
 *                 type: string
 *                 example: "123-456-7890"
 *               description:
 *                 type: string
 *                 example: "A high-tech focused school"
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Error creating school
 */
exports.createSchool = async (req, res) => {
    try {
        const school = new School(req.body);
        await school.save();
        res.status(201).json(school);
    } catch (err) {
        res.status(400).json({ message: 'Error creating school', error: err });
    }
};

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools
 *     tags: 
 *       - Schools
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of schools
 *       400:
 *         description: Error fetching schools
 */
exports.getSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.status(200).json(schools);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching schools', error: err });
    }
};

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: 
 *       - Schools
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     responses:
 *       200:
 *         description: School details
 *       400:
 *         description: Error fething school
 *       404:
 *         description: School not found
 * 
 */
exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id).populate('admins');
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json(school);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching school', error: err.message });
    }
};

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update a school by ID
 *     tags: 
 *       - Schools
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated School Name"
 *               address:
 *                 type: string
 *                 example: "Updated Address"
 *               contact:
 *                 type: string
 *                 example: "987-654-3210"
 *               description:
 *                 type: string
 *                 example: "Updated school description"
 *     responses:
 *       200:
 *         description: School updated successfully
 *       404:
 *         description: School not found
 *       400:
 *         description: Error updating school
 */
exports.updateSchool = async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json(school);
    } catch (err) {
        res.status(400).json({ message: 'Error updating school', error: err });
    }
};

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete a school by ID
 *     tags: 
 *       - Schools
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       404:
 *         description: School not found
 *       400:
 *         description: Error deleting school
 */
exports.deleteSchool = async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json({ message: 'School deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting school', error: err });
    }
};
