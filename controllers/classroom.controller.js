const Classroom = require('../models/Classroom.model');
const School = require('../models/School.model');

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
        res.status(400).json({ message: 'Error creating classroom', error: err.message });
    }
};

exports.getClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find({ school: req.params.schoolId });
        res.status(200).json(classrooms);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching classrooms', error: err.message });
    }
};

exports.updateClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.status(200).json(classroom);
    } catch (err) {
        res.status(400).json({ message: 'Error updating classroom', error: err.message });
    }
};

exports.deleteClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndDelete(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting classroom', error: err.message });
    }
};
