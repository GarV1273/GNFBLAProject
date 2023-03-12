const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const School = mongoose.model('School', SchoolSchema);
module.exports = School;