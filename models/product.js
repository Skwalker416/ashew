const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const productSchema = Schema({
    //     name: { type: String, required: true },
    //     description: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     rating: { type: Number, default: 0.0 },
    //     colours: [{ type: String }],
    //     image: { type: String, required: true },
    //     images: [{ type: String }],
    //     reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    //     numberOfReviews: { type: Number, default: 0 },
    //     sizes: [{ type: String }],
    //     category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    //     genderAgeCategory: { type: String, enum: ['men', 'women', 'unisex', 'kids'] },
    //     countInStock: { type: Number, required: true, min: 0, max: 255 },
    //     dateAdded: { type: Date, default: Date.now },
    // });
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: { type: String, required: false },
    time: { type: String, required: false },
    productTags: { type: Array, required: false },
    category: { type: String, required: false },
    productType: { type: Array, required: false },
    code: { type: String, required: false },
    isAvailable: { type: Boolean, default: true },
    vendor: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    rating: { type: Number, min: 1, max: 5, default: 3 },
    ratingCount: { type: String, default: "267" },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: { type: Array, default: [] },
    imageUrl: { type: Array, required: false },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
}, { timestamps: true }, );
// pre-save hook
productSchema.pre('save', async function(next) {
    if (this.reviews.length > 0) {
        await this.populate('reviews');

        const totalRating = this.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
        );

        this.rating = totalRating / this.reviews.length;
        this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
        this.numberOfReviews = this.reviews.length;
    }
    next();
});

productSchema.index({ name: 'text', description: 'text' });

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

exports.Product = model('Product', productSchema);