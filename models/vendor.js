const { model, Schema } = require('mongoose');
// const model = require('model');
const vendorSchema = Schema({
    // role: { type: String, required: true, trim: true },
    vendorName: { type: String, required: true, trim: true },
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


vendorSchema.index({ email: 1 }, { unique: true }); //makes email unique or bounces if the email already exists


vendorSchema.set('toObject', { virtuals: true });
vendorSchema.set('toJSON', { virtuals: true });
exports.Vendor = model('vendor', vendorSchema); //adds a user schema in MongoDB