const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
    },
    attendedEvents: {
        type: [Schema.Types.ObjectId],
    },
    studentId: {
        type: String,
        required: true,
    }
});

const Student = mongoose.model('Student',StudentSchema);
module.exports = Student;