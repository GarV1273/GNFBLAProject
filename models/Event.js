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
    }
});

const Event = new mongoose.model('Event', EventSchema);
module.exports = Event;