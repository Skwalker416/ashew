const { model, Schema } = require('mongoose');
// const model = require('model');
const eventOrganizerSchema = Schema({
    // role: { type: String, required: true, trim: true },
    eventOrganizerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    //Validator for email ===> validate: {validator: (value) => {
    //     //validate emails
    //     const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // },message: 'Please enter a valid email',
    // }},


    passwordHash: { type: String, required: true, trim: true },
    city: String,
    phone: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordOtp: Number, //must be null since the otp should vanish after been used
    resetPasswordOtpExpires: Date,
    wishlist: [ //like button
        {
            eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
            //what if the event gets deleted but still in their wish list
            eventName: { type: Number, required: true }
        }
    ]
});
eventOrganizerSchema.set('toObject', { virtuals: true });
eventOrganizerSchema.set('toJSON', { virtuals: true });

eventOrganizerSchema.index({ email: 1 }, { unique: true }); //makes email unique or bounces if the email already exists
exports.EventOrganizer = model('eventOrganizer', eventOrganizerSchema); //adds a user schema in MongoDB