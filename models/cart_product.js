const { Schema, model } = require('mongoose');

const cartProductSchema = Schema({

    product: { type: Schema.ObjectId, ref: ' Product' },

    quantity: { type: Number, default: 1 },
    selectedSize: String,
    selectedColor: String,

    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: String, required: true },
    reservationExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), //checks for unpaid orders then removes them every 30 min
    },
    reserved: { type: Boolean, default: true },
});



cartProductSchema.set('toObject', { virtuals: true });
cartProductSchema.set('toJSON', { virtuals: true });


exports.CartProduct = model('CartProduct', cartProductSchema);