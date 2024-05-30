const { Product } = require('../../models/product');
const media_helper = require('../../helpers/media_helper')
const util = require('util');
const { Category } = require('../../models/category');
exports.getProductsCount = async function(req, res) {
    try {
        const productCount = await Product.countDocuments();
        if (!product) {
            return res.status(500).json({ message: 'Could not count products' });
        }
        return res.json({ count })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};


exports.addProducts = async function(req, res) {
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
        const category = await Category.findByI(req.body.category);
        if (!category) return res.status(404).json({ message: 'Invalid Category.' })
        if (!category.markedForDeletion) {

            return res.status(404).json({ message: 'Category marked for deletion, you can not add products to this category.' })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.editProducts = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.deleteProductsImages = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.deleteProducts = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.getProducts = async function(req, res) {
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};