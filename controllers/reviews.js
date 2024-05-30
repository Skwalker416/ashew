const { User } = require('../models/user');
const { Review } = require('../models/review');
const { Product } = require('../models/product');
const { Event } = require('../models/event')
exports.leaveReview = async function(req, res) {
    try {

        const user = await User.findById(req.body.user);
        if (!user) return res.status(404).json({ message: 'Invalid user!' }); //trying to leave a review with a ham user

        const review = await new Review({
            ...req.body,
            userName: user.name,
        }).save(); // saves the review then returns the new review

        if (!review) {
            return res.status(400).json({ message: 'The review could not be added' })
        }

        let product = await Product.findById(req.params.id);
        // let event = await Event.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.reviews.push(review.id);
        product = await product.save();

        // if (!event) return res.status(404).json({ message: 'Event not found' })
        // event.reviews.push(review.id);
        // event = await event.save();

        if (!product)
            return res.status(500).json({ message: 'Internal server error' })
        return res.status(201).json({ product, review });

        // }}
        //     let event = await Event.findById(req.params.id);
        //     if (!event) return res.status(404).json({ message: 'Product not found' })
        //     event.reviews.push(review.id);
        //     event = await event.save();

        //     if (!event)
        //         return res.status(500).json({ message: 'Internal server error' })
        //     return res.status(201).json({ product, review });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.getProductReviews = async function(req, res) {
    try {


    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};