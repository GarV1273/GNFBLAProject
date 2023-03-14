const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;