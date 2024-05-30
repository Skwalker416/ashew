const jwt = require('jsonwebtoken');
// const chapa = require('chapa-nodejs');
// const Chapa = require('chapa-nodejs');
// const chapa = new Chapa({
//     secretKey: process.env.CHAPA_KEY,
//   });
// const chapaClient = new Chapa(process.env.CHAPA_KEY);
const { Chapa } = require ('chapa-nodejs');

const chapa = new Chapa(process.env.CHAPA_KEY);
// const Chapa = require('chapa-nodejs')(process.env.CHAPA_KEY);
const { User } = require('../models/user');
const { Product } = require('../models/product');
const { Event } = require('../models/event');
const { response } = require('express');
const orderController = require('./orders');
const ticketController = require('./tickets');
const { startSession } = require('mongoose');
const emailSender = require('../helpers/email_sender');
const orderMailBuilder = require('../helpers/order_complete_email_builder');
const ticketMailBuilder = require('../helpers/ticket_complete_email_builder');
// const { Vendor } = require('../models/vendor');


exports.checkout = async function(req, res) {
    const accessToken = req.header('Authorization').replace('Bearer', '').trim();
    const tokenData = jwt.decode(accessToken);

    const user = await User.findById(tokenData.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    // const vendor = await Vendor.findById(tokenData.id);
    // if (!vendor) {
    //     return res.status(404).json({ message: 'Vendor not found' })
    // }
    // const eventOrganizer = await EventOrganizer.findById(tokenData.id);
    // if (!eventOrganizer) {
    //     return res.status(404).json({ message: 'Event Organizer not found' })
    // }

    //NB both product and event must be implemented

    for (const cartItem of req.param.body.cartItems) { // checks every cart item

        const product = await Product.findById(cartItem.productId); //we make sure if the PRODUCT || EVENT exists
        if (!product) {
            return res.status(404).json({ message: `${cartItem.name} not found` })
        } else if (!cartItem.reserved && product.countInStock < cartItem.quantity) {
            const message = `${product.name}\nOrder for ${cartItem.quantity}, but only ${product.countInStock}`
            return res.status(400).json({ message })
        }
        const event = await Event.findById(cartItem.eventId); //we make sure if the PRODUCT || EVENT exists
        if (!event) {
            return res.status(404).json({ message: `${cartItem.name} not found` })
        } else if (!cartItem.reserved && event.countInStock < cartItem.quantity) {
            const message = `${event.name}\nOrder for ${cartItem.quantity}, but only ${event.countInStock}`
            return res.status(400).json({ message })
        }
    }
    let customerId;
    
    if (user.paymentCustomerId) {
        customerId = user.paymentCustomerId;

    } else {
        const customer = await Chapa.customers.create({
            metadata: { userId: tokenData.id }
        })

        customerId = customer.id;
    }
    const session = await Chapa.checkout.sessions.create({
        line_items: req.body.cartItems.map((item) => {
            return {
                price_data: {
                    currency: 'birr',
                    name: item.name,
                    product_data: {
                        name: item.name,
                        image: item.images,
                        metadata: {
                            productId: item.productId,
                            selectedSize: item.selectedSize ?? undefined,
                            selectedColor: item.selectedColor ?? undefined,
                        },
                    },
                    event_data: {
                        name: item.name,
                        image: item.images,
                        metadata: {
                            eventId: item.eventId,
                            selectedSize: item.selectedSize ?? undefined,
                            selectedColor: item.selectedColor ?? undefined,
                        },
                    },
                    //eg 100.95=>10095
                    unit_amount: (item.price * 100).toFixed(0),
                }
            }
        }),
        payment_method_options: {
            card: { setup_future_usage: 'on_session' }
        },
        billing_address_collection: auto,
        // shipping_address_collection:[{'Addis Ababa'}],

        phone_number_collection: { enabled: true },
        customer: customerId,
        mode: 'payment',
        success_url: 'https://asheweyna.biz/payment-success',
        cancel_url: 'https://asheweyna.biz/cart',
    });
    res.status(201).json({ url: session.url })
};
//The purchaser is always going to be the user since they buy products and purchase tickets
//so we don't need vendors but might add in the future to have CHAPA contribute to the ADMIN, VENDOR AND EVENT ORGANIZER

exports.webhook = function (req, res){
    const sig = request.headers['Chapa-Signature'];
    const crypto = require('crypto');
    const endpointSecret = process.env.CHAPA_WEBHOOK_KEY;
let event;

try{
    event = Chapa.webhooks.constructEvent(request.body, sig, endpointSecret);


    //validate event
    //if this don't work work capitalize Chapa
    // const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    // if (hash == req.headers['Chapa-Signature']) {
   
   
        // Retrieve the request's body
    // const event = req.body;
    // Do something with event  
    // }
    // res.send(200);
// });


}
catch (err){
    console.error('Webhook Error:', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;

}
if (event.type === 'checkout.session.complete'){
    const session = event.data.object;

    Chapa.customers.retrieve(session.customer)
    .then(async (customer) => {
        const lineItems = await Chapa.checkout.sessions.listLineItems(
            session.id,
            { expand: ['data.price.product']}
        );

        const orderItems = lineItems.sata.map((item) =>{
            return {
                quantity: item.quantity,
                product: item.price.product.metadata.productId,
                cartProductId: item.price.product.metadata.cartProductId,
                productPrice: item.price.unit_amount / 100,
                productName: item.price.product.name,
                productImage: item.price.product.images[0],
                selectedSize: item.price.product.metadata.selectedSize ?? undefined, //comes from the user
                selectedColor: item.price.product.metadata.selectedColor ?? undefined,
            }
        });
        const ticketItems = lineItems.sata.map((item) =>{
            return {
                quantity: item.quantity,
                event: item.price.event.metadata.eventId,
                cartEventId: item.price.event.metadata.cartEventId,
                eventPrice: item.price.unit_amount / 100,
                eventName: item.price.event.name,
                eventImage: item.price.event.images[0],
                selectedSize: item.price.event.metadata.selectedSize ?? undefined, //comes from the user
                selectedColor: item.price.event.metadata.selectedColor ?? undefined,
            }
        });

const address = session.shipping_details?.address ?? session.customer_details.address;
const order = await  orderController.addOrder({
    orderItems: orderItems,
    shippingAddress: address.line1 === 'N/A' ? address.line2: address.line1,
    city: address.city,
    postalCode: address.postal_code,
    count: address.country,
    phone: session.customer_details.phone,
    totalPrice: session.amount_total /100,
    user: customer.metadata.userId,
    paymentId: session.payment_intent,
});

const ticket = await  ticketController.addTicket({
    ticketItems: ticketItems,
    shippingAddress: address.line1 === 'N/A' ? address.line2: address.line1,
    city: address.city,
    postalCode: address.postal_code,
    count: address.country,
    phone: session.customer_details.phone,
    totalPrice: session.amount_total /100,
    user: customer.metadata.userId,
    paymentId: session.payment_intent,
});

let user = await User.findById(customer.metadata.userId);
if(user && !user.paymentCustomerId){
    user = await User.findByAndUpdate(
        customer.metadata.userId,
        { paymentCustomerId: session.customer},
        { new: true}
    );
}
const leanOrder = order.toObject();
leanOrder['orderItems'] = orderItems;

const leanTicket = ticket.toObject();
leanTicket['ticketItems'] = ticketItems;

await emailSender.sendMail(
    session.customer_details.email ?? user.email,
     'Your Asheweyna Order',
    orderMailBuilder.buildEmail(
        user.name,
    leanOrder,
     session.customer_details.name,
),
ticketMailBuilder.buildEmail(
    user.name,
 leanTicket,
 session.customer_details.name,
)
);
    }).catch((error) => console.error('WEB HOOK CATCHER:', err.message))
}else{
    console.log(`Unhandled event type ${event.type}`);
}
    
res.send().end();
};