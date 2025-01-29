const Student = require('../models/Student.model');
const Classroom = require('../models/Classroom.model');
const School = require('../models/School.model');

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
        res.status(400).json({ message: 'Error creating student', error: err.message });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching student', error: err.message });
    }
};

// Update student information
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ message: 'Error updating student', error: err.message });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting student', error: err.message });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const { firstName, lastName, school, classroom } = req.body;
        const schoolExists = await School.findById(school);
        if (!schoolExists) {
            return res.status(404).json({ message: 'School not found' });
        }
        
        const classroomExists = await Classroom.findById(classroom);
        if (!classroomExists || classroomExists.school.toString() !== school.toString()) {
            return res.status(404).json({ message: 'Classroom not found or does not belong to this school' });
        }

        const student = new Student({ firstName, lastName, school, classroom });
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: 'Error enrolling student', error: err.message });
    }
};

exports.transferStudent = async (req, res) => {
    try {
        const { classroom } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const classroomExists = await Classroom.findById(classroom);
        if (!classroomExists || classroomExists.school.toString() !== student.school.toString()) {
            return res.status(404).json({ message: 'Classroom not found or does not belong to this school' });
        }

        student.classroom = classroom;
        student.transferDate = new Date();
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ message: 'Error transferring student', error: err.message });
    }
};

exports.getStudentsBySchool = async (req, res) => {
    try {
        const students = await Student.find({ school: req.params.schoolId });
        res.status(200).json(students);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching students', error: err.message });
    }
};
