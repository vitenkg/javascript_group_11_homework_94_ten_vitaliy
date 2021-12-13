const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    subscriptionUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

SubscriptionSchema.plugin(idvalidator);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;