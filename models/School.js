const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    students: {
        type: [Schema.Types.ObjectId]
    },
    events: {
        type: [Schema.Types.ObjectId]
    }
});

const School = mongoose.model('School', SchoolSchema);
module.exports = School;