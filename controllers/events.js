const { Event } = require('../models/event');

//this Event controller is associated with minor functions such as search ...

exports.getEvents = async function(req, res) {
    let events;
    try {
        const page = req.body.page || 1;
        const pageSize = 10;
        const events = await Events.find({ category: categoryId });
        if (req.query.criteria) {
            let query = {};

            if (req.query.category) {
                query['category'] = req.query.category;
            }
            switch (req.query.criteria) {
                case 'newArrivals':
                    {
                        const toWeeksAgo = new Date(); // anything thats older than two weeks is not a NEW ARRIVAL  since it would take 2 weeks max to promote an event
                        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                        query['dateAdded'] = { $gte: twoWeeksAgo };
                        break;
                    }
                case 'popular':
                    query['rating'] = { $gte: 4.5 };
                    break;
                default:
                    break;
            }
            events = await Event.find(query)
                .select('-images -reviews -size')
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        } else if (req.query.category) {
            events = await events.find({ category: req.query.category })
                .select('-images -reviews -size')
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        } else {
            events = await Event.find()
                .select('-images -reviews -size')
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        }
        if (!events) {
            return res.status(404).json({ message: 'Events not found' });
        }
        return res.json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.searchEvents = async function(req, res) {
    try {
        const searchTerm = req.query.q;
        const page = req.body.page || 1;
        const pageSize = 10;

        let searchResults;
        let query = {};
        if (req.query.category) {
            query = { category: req.query.category };
            if (req.query.genderAgeCategory) {
                query['genderAgeCategory'] = req.query.genderAgeCategory.toLowerCase();
            }


            searchResults = await Event.find(query).skip((page - 1) * pageSize)
                .limit(pageSize);
        } else if (req.query.category && req.query.genderAgeCategory) {
            let query = { genderAgeCategory: req.query.genderAgeCategory.toLowerCase() };


            if (searchTerm) {
                query = {...query,
                    $text: {
                        $search: searchTerm,
                        $language: 'english', //might specify Amharic later
                        $caseSensitive: false,
                    },
                    category: req.query.category,
                }
            }

            searchResults = await Event.find(query).skip((page - 1) * pageSize)
                .limit(pageSize);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.getEventsById = async function(req, res) {
    try {
        const event = await Event.findById(req.params.id).select('-reviews');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};