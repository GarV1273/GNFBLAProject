const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const TeacherSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    school: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

TeacherSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    });
});

const Teacher = mongoose.model('User', TeacherSchema);
module.exports = Teacher;