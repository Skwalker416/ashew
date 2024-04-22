const { Schema, model } = require('mongoose');

const ticketItemSchema = Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, //will contain other things from the product detail
    eventName: { type: String, required: true },
    eventImage: { type: String, required: true },
    eventPrice: { type: String, required: true },

    // when the product is deleted the above schema will be greyed out or something
    quantity: { type: Number, default: 1 },
    selectedSize: String, // set to null because some products may not have sizes
    selectedColor: String, // #000000 set to null because some products may not have colors


})
ticketItemSchema.set('toObject', { virtuals: true });
ticketItemSchema.set('toJSON', { virtuals: true });
exports.TicketItem = model('TicketItem', ticketItemSchema)