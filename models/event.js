const { Schema, model } = require('mongoose');

eventSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    numberOfReviews: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    countInStock: { type: Number, required: true, min: 0, max: 10 },
    dateAdded: { type: Date, default: Date.now }

});
eventSchema.pre('save', async function(next) {
    if (this.review.length > 0) {
        await this.populate('reviews');
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0); //this will not save it rather just waits before saving all the reviews


        this.review = totalRating / this.reviews.length; //average rating
        this.rating = parseFloat((totalRating / this.reviews.length))
        this.numberOfReviews = this.reviews.length;
    }
    next();
});

//enabling forward text search by a user
eventSchema.index({ name: 'text', description: 'text' });

// in order to convert the schema to Json
//when ever a flutter client fetches for themselves they are going to get the normal id/ will apear normal rather as _id property

eventSchema.set('toObject', { virtuals: true });
eventSchema.set('toJSON', { virtuals: true });

exports.Event = model('Event', eventSchema)