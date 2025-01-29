const School = require('../models/School.model');

exports.createSchool = async (req, res) => {
    try {
        const school = new School(req.body);
        await school.save();
        res.status(201).json(school);
    } catch (err) {
        res.status(400).json({ message: 'Error creating school', error: err });
    }
};

exports.getSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.status(200).json(schools);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching schools', error: err });
    }
};

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
