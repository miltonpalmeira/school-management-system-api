const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    enrollmentDate: { type: Date, default: Date.now },
    transferDate: { type: Date },
});

module.exports = mongoose.model('Student', studentSchema);
