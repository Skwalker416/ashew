const { Event } = require('../../models/event');
// const { Review } = require('../../models/review');
const media_helper = require('../../helpers/media_helper')
const util = require('util');
const { Category } = require('../../models/category');
const multer = require('multer');
const { isArrayBufferView } = require('util/types');
const { default: mongoose } = require('mongoose');
exports.getEventsCount = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};


exports.addEvent = async function(req, res) {
    try {
        const uploadImage = util.promisify(
            media_helper.upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }])
        );

        try {

            await uploadImage(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                type: error.code,
                message: `${error.message}{${err.field}}`,
                storageErrors: error.storageErrors,

            });
        }
        // const category = await Category.findById(req.body.category); {
        //     if (!category) return res.status(404).json({ message: 'Invalid Category.' })
        // }
        // if (!category.markedForDeletion) {

        //     return res.status(404).json({ message: 'Category marked for deletion, you can not add events to this category.' })
        // }
        const image = req.files['image'][0];
        if (!image) return res.status(404).json({ message: 'No file found' });
        req.body['image'] = `${req.protocol}://${req.get('hist')}/${image.path}`;

        const gallery = req.files['images'];
        const imagePaths = [];
        if (gallery) {
            for (const image of gallery) {
                const imagePath = `${req.protocol}://${req.get('hist')}/${image.path}`;
                imagePaths.push(imagePath);
            }
        }
        if (imagePaths.length > 0) {
            req.body['images'] = imagePaths;

        }

        const event = await new Event(req.body).save();
        if (!event) {
            return res.status(500).json({ message: 'The event could not be created' })
        }
        return res.status(201).json(event);
    } catch (error) {
        console.error(error);
        if (err instanceof multer.MulterError) {
            return res.status(err.code).json({ type: error.name, message: error.message })
        }
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

// exports.addEvent = async(req, res) => {
//     const { name, description, price, time, category } = req.body;

//     if (!name || !description || !price || !time || !category) {
//         return res.status(400).json({ status: false, message: "You have a missing field" });
//     }

//     try {
//         const newEvent = new Event(req.body);

//         await newEvent.save();

//         res.status(201).json({ status: true, message: "Event has been successfully added" });
//     } catch (error) {
//         res.status(500).json({ status: false, message: error.message });
//     }
// }

exports.editEvent = async function(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id) || //this my not be useful for vendor to look for a Event by id
            !(await Event.findById(req.params.id))
        ) {
            res.status(404).json({ message: 'Invalid Event' });
        }
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(404).json({ message: 'Invalid category' })
            }
            if (!category.markedForDeletion) {

                return res.status(404).json({ message: 'Category marked for deletion, you can not add event to this category.' })
            }

            //!!!!!! ADDING EVENT !!!!!
            let event = await Event.findById(req.params.id);

            if (req.body.images) {
                const limit = 10 - event.images.length;
                const uploadGallery = util.promisify(
                    media_helper.fields([{ name: 'images', maxCount: limit }])

                );
                try {

                    await uploadGallery(req, res);
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        type: error.code,
                        message: `${error.message}{${err.field}}`,
                        storageErrors: error.storageErrors,

                    });
                }
                const imageFiles = req.files['images'];
                const galleryUpdate = imageFiles && imageFiles.length > 0;
                if (updateGallery) {
                    const imagePaths = [];
                    for (const image of gallery) {
                        const imagePath = `${req.protocol}://${req.get('hist')}/${image.path}`;
                        imagePaths.push(imagePath);
                    }
                    req.body['images'] = [...event.images, ...imagePaths];

                }
            }
            if (req.body.image) {
                const uploadImage = util.promisify(media_helper.upload.field([{ name: 'image', maxCount: 1 }]));;
                try {
                    await uploadImage(req, res);

                } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        type: error.name,
                        message: `${error.message }{${err.field}})`,
                        storageErrors: error.storageErrors,
                    });
                }

                const image = req.files['image'][0];
                if (!image) return res.status(404).json({ message: 'No file found' });

                req.body['image'] = `${req.protocol}://${req.get('host')}/${image.path}`;
            }
        }

        const updatedEvent = await Event.findByIdUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ type: error.name, message: error.message })
    } catch (error) { //following catch error will be for image manipulation
        console.error(error);
        if (err instanceof multer.MulterError) {
            return res.status(err.code).json({ type: error.name, message: error.message })
        }
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.deleteEventsImages = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.deleteEvent = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.getEvents = async function(req, res) {
    try {
        const page = req.query.page || 1;
        const detailed = +req.query.detailed;
        const pageSize = 10;

        //page=
        //limit=10
        const events = await Event.find().select('-reviews -reviews').skip((page - 1) * pageSize).limit(pageSize);

        if (!events) {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.json(events);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};