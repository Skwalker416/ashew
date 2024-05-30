const { model, Schema } = require('mongoose');
// const model = require('model');
const vendorSchema = Schema({
    // role: { type: String, required: true, trim: true },
    vendorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    products: { type: Array },
    //     delivery: { type: Boolean, required: false, default: true },
    //     pickup: { type: Boolean, required: false, default: true },
    //     isAvailable: { type: Boolean, required: false, default: true }, //makes a vendor available for an event open or closed might not use this!!!!
    //     rating: { type: Number, min: 1, max: 5 }, //work in theory
    //     ratingCount: { type: String },
    //     passwordHash: { type: String, required: true, trim: true },
    //     city: String,
    //     phone: { type: String, required: true, trim: true },
    //     isAdmin: { type: Boolean, default: false },
    //     taxNumber: { type: Number },
    //     resetPasswordOtp: Number, //must be null since the otp should vanish after been used
    //     resetPasswordOtpExpires: Date,

    // });

    imageUrl: { type: String, required: true },

    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    owner: { type: String, required: true },
    code: { type: String, required: true },
    logoUrl: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    ratingCount: { type: String, default: "267" },
    verification: { type: String, default: "Pending", enum: ["Pending", "Verified", "Rejected"] },
    verificationMessage: { type: String, default: "Vendor is under review. We will notify you once it is verified." },
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

vendorSchema.index({ email: 1 }, { unique: true }); //makes email unique or bounces if the email already exists


vendorSchema.set('toObject', { virtuals: true });
vendorSchema.set('toJSON', { virtuals: true });
exports.Vendor = model('vendor', vendorSchema); //adds a user schema in MongoDB