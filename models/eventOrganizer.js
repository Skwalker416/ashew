const { model, Schema } = require('mongoose');
// const model = require('model');
const eventOrganizerSchema = Schema({
    // role: { type: String, required: true, trim: true },
    eventOrganizerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    taxNumber: { type: Number },

    passwordHash: { type: String, required: true, trim: true },
    city: String,
    phone: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordOtp: Number, //must be null since the otp should vanish after been used
    resetPasswordOtpExpires: Date,

    coords: {
        id: { type: String },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta: { type: Number, default: 0.0122 },
        longitudeDelta: { type: Number, default: 0.0122 },
        address: { type: String, required: true },
        title: { type: String, required: true },
    }

});
eventOrganizerSchema.set('toObject', { virtuals: true });
eventOrganizerSchema.set('toJSON', { virtuals: true });

eventOrganizerSchema.index({ email: 1 }, { unique: true }); //makes email unique or bounces if the email already exists
exports.EventOrganizer = model('eventOrganizer', eventOrganizerSchema); //adds a user schema in MongoDB