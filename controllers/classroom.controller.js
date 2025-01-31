const Classroom = require('../models/Classroom.model');
const School = require('../models/School.model');

/**
 * @swagger
 * tags:
 *   name: Classrooms
 *   description: Classroom management API
 */

/**
 * @swagger
 * /api/classrooms:
 *   post:
 *     summary: Create a new classroom
 *     tags:
 *       - Classroom
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               school:
 *                 type: string
 *                 description: School ID
 *               capacity:
 *                 type: integer
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: School not found
 */
exports.createClassroom = async (req, res) => {
  try {
    const { name, school, capacity, resources } = req.body;

    const schoolExists = await School.findById(school);
    if (!schoolExists) {
      return res.status(404).json({ message: 'School not found' });
    }

    const classroom = new Classroom({ name, school, capacity, resources });
    await classroom.save();

    res.status(201).json(classroom);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating classroom', error: err.message });
  }
};

/**
 * @swagger
 * /api/classrooms:
 *   get:
 *     summary: Get all classrooms
 *     tags:
 *       - Classroom
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of classrooms
 *       400:
 *         description: Internal server error
 */
exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('school');
    res.status(200).json(classrooms);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error fetching classrooms', error: err.message });
  }
};

/**
 * @swagger
 * /api/classrooms/{id}:
 *   get:
 *     summary: Get a classroom by ID
 *     tags:
 *       - Classroom
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classroom details
 *       404:
 *         description: Classroom not found
 *       400:
 *         description: Internal server error
 */
exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate(
      'school'
    );
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error fetching classroom', error: err.message });
  }
};

/**
 * @swagger
 * /api/classrooms/{id}:
 *   put:
 *     summary: Update a classroom by ID
 *     tags: 
 *       - Classroom
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               school:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Classroom details
 *       404:
 *         description: Classroom not found
 *       400:
 *         description: Internal server error
 */
exports.updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error updating classroom', error: err.message });
  }
};

/**
 * @swagger
 * /api/classrooms/{id}:
 *   delete:
 *     summary: Delete a classroom by ID
 *     description: Removes a classroom from the database by its ID.
 *     tags:
 *       - Classroom
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the classroom to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classroom deleted
 *       404:
 *         description: Classroom not found
 *       400:
 *         description: Internal server error
 */
exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error deleting classroom', error: err.message });
  }
};
