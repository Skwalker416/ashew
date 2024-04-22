const { Schema, model } = require('mongoose');

const tokenSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }, // ['user', 'eventOrganizer', 'vendor'] },
    refreshToken: { type: String, required: true },
    accessToken: String,
    createdAt: { type: Date, default: Date.now, expires: 60 * 86400 }, //expired in 60 days


    vendorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'vendor'
    }, // ['user', 'eventOrganizer', 'vendor'] },
    refreshToken: { type: String, required: true },
    accessToken: String,
    createdAt: { type: Date, default: Date.now, expires: 60 * 86400 },

    eventOrganizerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'eventOrganizer'
    }, // ['user', 'eventOrganizer', 'vendor'] },
    refreshToken: { type: String, required: true },
    accessToken: String,
    createdAt: { type: Date, default: Date.now, expires: 60 * 86400 } //expired in 60 days//expired in 60 days

});

tokenSchema.set('toObject', { virtuals: true });
tokenSchema.set('toJSON', { virtuals: true });
exports.Token = model('Token', tokenSchema);