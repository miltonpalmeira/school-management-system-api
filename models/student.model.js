const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    enrollmentDate: { type: Date, default: Date.now },
    transferDate: { type: Date },
});

module.exports = mongoose.model('Student', studentSchema);