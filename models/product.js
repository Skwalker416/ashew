const { Schema, model } = require('mongoose');

const productSchema = Schema({
    //schema stored as _id in the database
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    colors: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    numberOfReviews: { type: Number, default: 0 },
    sizes: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    genderAgeCategory: { type: String, enum: ['men', 'women', 'unisex'] }, //its a type string but enum indicates that it should be in the list of constraints
    countInStock: { type: Number, required: true, min: 0, max: 200 },
    dateAdded: { type: Date, default: Date.now }

});

// pre_save hook //hey before you save that data let me do something real quick 

productSchema.pre('save', async function(next) {
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
productSchema.index({ name: 'text', description: 'text' });

// in order to convert the schema to Json
//when ever a flutter client fetches for themselves they are going to get the normal id/ will apear normal rather as _id property

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

exports.Product = model('Product', productSchema)