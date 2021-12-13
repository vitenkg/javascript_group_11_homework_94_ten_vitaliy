const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const EventSchema = new mongoose.Schema({
   datetime: {
       type: String,
       required: true
   },
    event: {
        type: String,
        required: true
    },
    lasting: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

EventSchema.plugin(idvalidator);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;