const Student = require('../models/Student.model');
const Classroom = require('../models/Classroom.model');
const School = require('../models/School.model');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Students management API
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags:
 *       - Student
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Student"
 *               lastName:
 *                 type: string
 *                 example: "#1"
 *               school:
 *                 type: string
 *                 example: "school id"
 *               classroom:
 *                 type: string
 *                 example: "classroom id"
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Error creating student
 */
exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, school, classroom } = req.body;

    if (school) {
      const schoolExists = await School.findById(school);
      if (!schoolExists) {
        return res.status(404).json({ message: 'School not found' });
      }
    }

    if (classroom) {
      const classroomExists = await Classroom.findById(classroom);
      if (!classroomExists) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
    }

    const student = new Student({ firstName, lastName, school, classroom });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 *       400:
 *         description: Error fetching student
 */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error fetching student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     tags:
 *       - Student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Student"
 *               lastName:
 *                 type: string
 *                 example: "Updated"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       400:
 *         description: Error updating student
 */
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error updating student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       400:
 *         description: Error deleting student
 */
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error deleting student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/enroll:
 *   post:
 *     summary: Enroll a student in a school and classroom
 *     tags:
 *       - Student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school:
 *                 type: string
 *                 example: "School id"
 *               classroom:
 *                 type: string
 *                 example: "Classroom id"
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *       404:
 *         description: School or Classroom not found
 *       400:
 *         description: Error enrolling student
 */
exports.enrollStudent = async (req, res) => {
  try {
    const { school, classroom } = req.body;
    const schoolExists = await School.findById(school);
    if (!schoolExists) {
      return res.status(404).json({ message: 'School not found' });
    }

    const classroomExists = await Classroom.findById(classroom);
    if (
      !classroomExists ||
      classroomExists.school.toString() !== school.toString()
    ) {
      return res.status(404).json({
        message: 'Classroom not found or does not belong to this school',
      });
    }

    const student = new Student({ school, classroom });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error enrolling student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/transfer/{id}:
 *   put:
 *     summary: Transfer a student to a different classroom
 *     tags:
 *       - Student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classroom
 *             properties:
 *               classroom:
 *                 type: string
 *                 example: "new classroom id"
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *       404:
 *         description: Student or Classroom not found
 *       400:
 *         description: Error transferring student
 */
exports.transferStudent = async (req, res) => {
  try {
    const { classroom } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const classroomExists = await Classroom.findById(classroom);
    if (!classroomExists) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (
      !classroomExists.school ||
      !student.school ||
      classroomExists.school.toString() !== student.school.toString()
    ) {
      return res.status(404).json({
        message: 'Classroom not found or does not belong to this school',
      });
    }

    student.classroom = classroom;
    student.transferDate = new Date();
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error transferring student', error: err.message });
  }
};

/**
 * @swagger
 * /api/students/school/{schoolId}:
 *   get:
 *     summary: Get all students by school ID
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: The school ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students in the school
 *       400:
 *         description: Error fetching students
 */
exports.getStudentsBySchool = async (req, res) => {
  try {
    const students = await Student.find({ school: req.params.schoolId });
    res.status(200).json(students);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error fetching students', error: err.message });
  }
};
