const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    }
});

const Student = new mongoose.model('Student',StudentSchema);
module.exports = Student;