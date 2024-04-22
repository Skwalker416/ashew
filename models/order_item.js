const { Schema, model } = require('mongoose');

const orderItemSchema = Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, //will contain other things from the product detail
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: String, required: true },

    // when the product is deleted the above schema will be greyed out or something
    quantity: { type: Number, default: 1 },
    selectedSize: String, // set to null because some products may not have sizes
    selectedColor: String, // #000000 set to null because some products may not have colors


})
orderItemSchema.set('toObject', { virtuals: true });
orderItemSchema.set('toJSON', { virtuals: true });

exports.OrderItem = model('OrderItem', orderItemSchema)