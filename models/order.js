const { Schema, model, SchemaType } = require('mongoose');
// const { Vendor } = require('./vendor');
// const { EventEmitterAsyncResource } = require('nodemailer/lib/auth2');
// const { EventOrganizer } = require('./eventOrganizer');

const orderSchema = Schema({
    orderItems: [
        { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    ],
    shippingAddress: { type: String, required: true }, //will consult the team if we want to make product deliveries
    city: { type: String, required: true },
    // country:{type: String, required: true}       //not necessary
    phone: { type: String, required: true },
    paymentId: { type: String }, //will not be using stripe rather chapa Api because we create the order and then make them pay the payment the order will be pending
    status: {

        type: String,
        required: true,
        default: 'pending',
        enum: [
            'pending',
            'processed',
            'cancelled',
            'expired',
            //  'out-for-delivery' //if we agree to make the orders be delivered
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
            //  'out-for-delivery' //if we agree to make the orders be delivered
            'on-hold' // incase the customer sets the pick up at the event and the event gets POSTPONED OR CANCELLED
        ],
        required: true,
        default: 'pending',
    },
    totalPrice: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // vendor: {type: Schema.Types.ObjectId, ref:'Vendor'},
    // eventOrganizer: {type: Schema.Types.ObjectId, ref:'EventOrganizer'},  // User is the only one capable of purchasing
    dateOrdered: { type: Date, default: Date.now }
});

orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });
exports.Order = model('Order', orderSchema);