const { Schema, model } = require('mongoose');
// const { Vendor } = require('./vendor');
// const { EventEmitterAsyncResource } = require('nodemailer/lib/xoauth2');
// const { EventOrganizer } = require('./eventOrganizer');

const ticketSchema = Schema({
    // shippingAddress:{type: String, required: true},  //will consult the team if we want to make product deliveries
    // city:{type: String, required: true}, 
    // country:{type: String, required: true}       
    phone: { type: String, required: true },
    paymentId: String, //will not be using stripe rather chapa Api because we create the ticket and then make them pay the payment the ticket will be pending
    status: {

        type: String,
        required: true,
        default: 'pending',
        enum: [
            'pending',
            'processed',
            'cancelled',
            'expired',
            //  'out-for-delivery' //if we agree to make the tickets be delivered
            'on-hold' // incase the customer sets the pick up at the event and the event gets POSTPONED OR CANCELLED
        ]

    },
    statusHistory: {
        type: [String],
        enum: [
            'pending',
            'processed',
            'cancelled',
            'expired',
            //  'out-for-delivery' //if we agree to make the tickets be delivered
            'on-hold' // incase the customer sets the pick up at the event and the event gets POSTPONED OR CANCELLED
        ],
        required: true,
        default: 'pending',
    },
    totalPrice: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // vendor: {type: Schema.Types.ObjectId, ref:'Vendor'},
    // eventOrganizer: {type: Schema.Types.ObjectId, ref:'EventOrganizer'},  // User is the only one capable of purchasing
    dateOfTicketOrder: { type: Date, default: Date.now }
});

ticketSchema.set('toObject', { virtuals: true });
ticketSchema.set('toJSON', { virtuals: true });
exports.Ticket = model('Ticket', ticketSchema);