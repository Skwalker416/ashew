const { Schema, model } = require('mongoose');

const cartEventSchema = Schema({


    event: { type: Schema.ObjectId, ref: ' Event' },
    quantity: { type: Number, default: 1 },
    selectedSize: String,
    selectedColor: String,
    eventName: { type: String, required: true },
    eventImage: { type: String, required: true },
    eventPrice: { type: String, required: true },

    reservationExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), //checks for unpaid orders then removes them every 30 min
    },
    reserved: { type: Boolean, default: true },
});



cartEventSchema.set('toObject', { virtuals: true });
cartEventSchema.set('toJSON', { virtuals: true });

// exports.Ticket = model('Ticket', ticketSchema);

exports.CartEvent = model('CartEvent', cartEventSchema);