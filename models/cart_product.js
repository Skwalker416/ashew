const { Schema, model } = require('mongoose');

const cartProductSchema = Schema({

    product: { type: Schema.ObjectId, ref: ' Product' },
    event: { type: Schema.ObjectId, ref: ' Event' },
    quantity: { type: Number, default: 1 },
    selectedSize: String,
    selectedColor: String,
    eventName: { type: String, required: true },
    eventImage: { type: String, required: true },
    eventPrice: { type: String, required: true },
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

// exports.Ticket = model('Ticket', ticketSchema);
// exports.Order = model('Order', orderSchema);
exports.Order = model('Order', orderSchema);