const { Schema, model } = require("mongoose")

const reviewSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // userName: { type: String, required: true },
    comment: { type: String, trim: true },
    rating: { type: String, required: true },
    // date: { type: String, required: true },
});


reviewSchema.set('toObject', { virtuals: true });
reviewSchema.set('toJSON', { virtuals: true });

exports.Review = model('Review', reviewSchema)