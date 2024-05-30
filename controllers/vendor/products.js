// const { Product } = require('../../models/product');
// const { Review } = require('../../models/review');
// const media_helper = require('../../helpers/media_helper')
// const util = require('util');
// const { Category } = require('../../models/category');
// const multer = require('multer');
// const { isArrayBufferView } = require('util/types');
// const { default: mongoose } = require('mongoose');
// const { addProduct } = require('../admin/products');


// exports.editProduct = async function(req, res) {
//     try {
//         if (!mongoose.isValidObjectId(req.params.id) || //this my not be useful for vendor to look for a product by id
//             !(await Product.findById(req.params.id))
//         ) {
//             res.status(404).json({ message: 'Invalid Product' });
//         }
//         if (req.body.category) {
//             const category = await Category.findById(req.body.category);
//             if (!category) {
//                 return res.status(404).json({ message: 'Invalid category' })
//             }
//             if (!category.markedForDeletion) {

//                 return res.status(404).json({ message: 'Category marked for deletion, you can not add products to this category.' })
//             }

//             //!!!!!! ADDING PRODUCT !!!!!
//             let product = await Product.findById(req.params.id);

//             if (req.body.images) {
//                 const limit = 10 - product.images.length;
//                 const uploadGallery = util.promisify(
//                     media_helper.fields([{ name: 'images', maxCount: limit }])

//                 );
//                 try {

//                     await uploadGallery(req, res);
//                 } catch (error) {
//                     console.error(error);
//                     return res.status(500).json({
//                         type: error.code,
//                         message: `${error.message}{${err.field}}`,
//                         storageErrors: error.storageErrors,

//                     });
//                 }
//                 const imageFiles = req.files['images'];
//                 const galleryUpdate = imageFiles && imageFiles.length > 0;
//                 if (updateGallery) {
//                     const imagePaths = [];
//                     for (const image of gallery) {
//                         const imagePath = `${req.protocol}://${req.get('hist')}/${image.path}`;
//                         imagePaths.push(imagePath);
//                     }
//                     req.body['images'] = [...product.images, ...imagePaths];

//                 }
//             }
//             if (req.body.image) {
//                 const uploadImage = util.promisify(media_helper.upload.field([{ name: 'image', maxCount: 1 }]));;
//                 try {
//                     await uploadImage(req, res);

//                 } catch (error) {
//                     console.error(error);
//                     return res.status(500).json({
//                         type: error.name,
//                         message: `${error.message }{${err.field}})`,
//                         storageErrors: error.storageErrors,
//                     });
//                 }

//                 const image = req.files['image'][0];
//                 if (!image) return res.status(404).json({ message: 'No file found' });

//                 req.body['image'] = `${req.protocol}://${req.get('host')}/${image.path}`;
//             }
//         }

//         const updatedProduct = await Product.findByIdUpdate(
//             req.params.id,
//             req.body, { new: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({ message: err.message });
//         }
//         return res.status(500).json({ type: error.name, message: error.message })
//     } catch (error) { //following catch error will be for image manipulation
//         console.error(error);
//         if (err instanceof multer.MulterError) {
//             return res.status(err.code).json({ type: error.name, message: error.message })
//         }
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };
// // exports.addProduct = async function(req, res) {
// //     try {
// //         const uploadImage = util.promisify(
// //             media_helper.upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }])
// //         );

// //         try {

// //             await uploadImage(req, res);
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({
// //                 type: error.code,
// //                 message: `${error.message}{${err.field}}`,
// //                 storageErrors: error.storageErrors,

// //             });
// //         }
// //         const category = await Category.findById(req.body.category); {
// //             if (!category) return res.status(404).json({ message: 'Invalid Category.' })
// //                 // }
// //                 // if (!category.markedForDeletion) {

// //             //     return res.status(404).json({ message: 'Category marked for deletion, you can not add products to this category.' })
// //         }
// //         const image = req.files['image'][0];
// //         if (!image) return res.status(404).json({ message: 'No file found' });
// //         req.body['image'] = `${req.protocol}://${req.get('hist')}/${image.path}`;

// //         const gallery = req.files['images'];
// //         const imagePaths = [];
// //         if (gallery) {
// //             for (const image of gallery) {
// //                 const imagePath = `${req.protocol}://${req.get('hist')}/${image.path}`;
// //                 imagePaths.push(imagePath);
// //             }
// //         }
// //         if (imagePaths.length > 0) {
// //             req.body['images'] = imagePaths;

// //         }

// //         const product = await new Product(req.body).save();
// //         if (!product) {
// //             return res.status(500).json({ message: 'The product could not be created' })
// //         }
// //         return res.status(201).json(product);
// //     } catch (error) {
// //         console.error(error);
// //         if (err instanceof multer.MulterError) {
// //             return res.status(err.code).json({ type: error.name, message: error.message })
// //         }
// //         return res.status(500).json({ type: error.name, message: error.message });
// //     }
// // };
// exports.addProduct = async function(req, res) {
//     try {
//         const uploadImage = util.promisify(
//             media_helper.upload.fields([
//                 { name: 'image', maxCount: 1 },
//                 { name: 'images', maxCount: 10 },
//             ])
//         );
//         try {
//             await uploadImage(req, res);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 type: error.code,
//                 message: `${error.message}{${err.field}}`,
//                 storageErrors: error.storageErrors,
//             });
//         }

//         const category = await Category.findById(req.body.category);
//         if (!category) {
//             return res.status(404).json({ message: 'Invalid Category.' });
//         }
//         if (category.markedForDeletion) {
//             return res.status(404).json({
//                 message: 'Category marked for deletion, you cannot add products to this category.',
//             });
//         }
//         const image = req.files['image'][0];
//         if (!image) return res.status(404).json({ message: 'No file found!' });

//         req.body['image'] = `${req.protocol}://${req.get('host')}/${image.path}`;

//         const gallery = req.files['images'];
//         const imagePaths = [];
//         if (gallery) {
//             for (const image of gallery) {
//                 const imagePath = `${req.protocol}://${req.get('host')}/${image.path}`;
//                 imagePaths.push(imagePath);
//             }
//         }
//         if (imagePaths.length > 0) {
//             req.body['images'] = imagePaths;
//         }

//         const product = await new Product(req.body).save();
//         if (!product) {
//             return res
//                 .status(500)
//                 .json({ message: 'The product could not be created' });
//         }
//         return res.status(201).json({ message: 'Product Added' }, product);
//     } catch (error) {
//         console.error(error);
//         if (err instanceof multer.MulterError) {
//             return res.status(err.code).json({ message: err.message });
//         }
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };

// // const { name } = req.body;

// // if (!name) {
// //     return res.status(400).json({ status: false, message: 'You have a missing field' })
// // }
// // try {
// //     const newProduct = new Product(req.body);
// //     await newProduct.save();
// //     res.status(200).json({ status: true, message: 'Product has successfully been submitted for review' });
// // } catch (error) {
// //     res.status(500).json({ status: false, message: error.message });
// // };
// exports.getProducts = async function(req, res) {
//     try {
//         const page = req.query.page || 1;
//         const detailed = +req.query.detailed;
//         const pageSize = 10;

//         //page=
//         //limit=10
//         const products = await Product.find().select('-reviews -reviews').skip((page - 1) * pageSize).limit(pageSize);

//         if (!products) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         return res.json(products);

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };


// // exports.addProduct = async(req, res) => {
// //     const { name, description, price, countInStock, category } = req.body;

// //     if (!name || !description || !price || !countInStock || !category) {
// //         return res.status(400).json({ status: false, message: "You have a missing field" });
// //     }

// //     try {
// //         const newProduct = new Product(req.body);

// //         await newProduct.save();

// //         res.status(201).json({ status: true, message: "Event has been successfully added" });
// //     } catch (error) {
// //         res.status(500).json({ status: false, message: error.message });
// //     }

// // };

const { Product } = require('../../models/product');
const { Review } = require('../../models/review');
const media_helper = require('../../helpers/media_helper');
const util = require('util');
const { Category } = require('../../models/category');
const multer = require('multer');
const { default: mongoose } = require('mongoose');

// exports.getProductsCount = async function(req, res) {
//     try {
//         const count = await Product.countDocuments();
//         if (!count) {
//             return res.status(500).json({ message: 'Could not count products' });
//         }
//         return res.json({ count });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };
// exports.addProduct = async function(req, res) {
//     try {
//         const uploadImage = util.promisify(
//             media_helper.upload.fields([
//                 { name: 'image', maxCount: 1 },
//                 { name: 'images', maxCount: 10 },
//             ])
//         );
//         try {
//             await uploadImage(req, res);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 type: error.code,
//                 message: `${error.message}{${err.field}}`,
//                 storageErrors: error.storageErrors,
//             });
//         }

//         // const category = await Category.findById(req.body.category);
//         // if (!category) {
//         //     return res.status(404).json({ message: 'Invalid Category.' });
//         // }
//         // if (category.markedForDeletion) {
//         //     return res.status(404).json({
//         //         message: 'Category marked for deletion, you cannot add products to this category.',
//         //     });
//         // }
//         const image = req.files['image'][0];
//         if (!image) return res.status(404).json({ message: 'No file found!' });

//         req.body['image'] = `${req.protocol}://${req.get('host')}/${image.path}`;

//         const gallery = req.files['images'];
//         const imagePaths = [];
//         if (gallery) {
//             for (const image of gallery) {
//                 const imagePath = `${req.protocol}://${req.get('host')}/${image.path}`;
//                 imagePaths.push(imagePath);
//             }
//         }
//         if (imagePaths.length > 0) {
//             req.body['images'] = imagePaths;
//         }

//         const product = await new Product(req.body).save();
//         if (!product) {
//             return res
//                 .status(500)
//                 .json({ message: 'The product could not be created' });
//         }
//         return res.status(201).json(product);
//     } catch (error) {
//         console.error(error);
//         if (error instanceof multer.MulterError) {
//             return res.status(err.code).json({ message: err.message });
//         }
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };
// exports.editProduct = async function(req, res) {
//     try {
//         if (!mongoose.isValidObjectId(req.params.id) ||
//             !(await Product.findById(req.params.id))
//         ) {
//             return res.status(404).json({ message: 'Invalid Product' });
//         }
//         if (req.body.category) {
//             const category = await Category.findById(req.body.category);
//             if (!category) {
//                 return res.status(404).json({ message: 'Invalid Category' });
//             }
//             if (category.markedForDeletion) {
//                 return res.status(404).json({
//                     message: 'Category marked for deletion, you cannot add products to this category.',
//                 });
//             }

//             const product = await Product.findById(req.params.id);

//             if (req.body.images) {
//                 const limit = 10 - product.images.length;
//                 const uploadGallery = util.promisify(
//                     media_helper.upload.fields([{ name: 'images', maxCount: limit }])
//                 );
//                 try {
//                     await uploadGallery(req, res);
//                 } catch (error) {
//                     console.error(error);
//                     return res.status(500).json({
//                         type: error.code,
//                         message: `${error.message}{${err.field}}`,
//                         storageErrors: error.storageErrors,
//                     });
//                 }
//                 const imageFiles = req.files['images'];
//                 const updateGallery = imageFiles && imageFiles.length > 0;
//                 if (updateGallery) {
//                     const imagePaths = [];
//                     for (const image of gallery) {
//                         const imagePath = `${req.protocol}://${req.get('host')}/${
//               image.path
//             }`;
//                         imagePaths.push(imagePath);
//                     }
//                     req.body['images'] = [...product.images, ...imagePaths];
//                 }
//             }
//             if (req.body.image) {
//                 const uploadImage = util.promisify(
//                     media_helper.upload.fields([{ name: 'image', maxCount: 1 }])
//                 );
//                 try {
//                     await uploadImage(req, res);
//                 } catch (error) {
//                     console.error(error);
//                     return res.status(500).json({
//                         type: error.code,
//                         message: `${error.message}{${err.field}}`,
//                         storageErrors: error.storageErrors,
//                     });
//                 }
//                 const image = req.files['image'][0];
//                 if (!image) return res.status(404).json({ message: 'No file found!' });

//                 req.body['image'] = `${req.protocol}://${req.get('host')}/${
//           image.path
//         }`;
//             }
//         }
//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body, { new: true }
//         );
//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         return res.json(updatedProduct);
//     } catch (error) {
//         console.error(error);
//         if (err instanceof multer.MulterError) {
//             return res.status(err.code).json({ message: err.message });
//         }
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };
// exports.deleteProductImages = async function(req, res) {
//     try {
//         const productId = req.params.id;
//         const { deletedImageUrls } = req.body;

//         if (!mongoose.isValidObjectId(productId) ||
//             !Array.isArray(deletedImageUrls)
//         ) {
//             return res.status(400).json({ message: 'Invalid request data' });
//         }

//         await media_helper.deleteImages(deletedImageUrls);
//         const product = await Product.findById(productId);

//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         product.images = product.images.filter(
//             (image) => !deletedImageUrls.includes(image)
//         );

//         await product.save();

//         return res.status(204).end();
//     } catch (error) {
//         console.error(`Error deleting product: ${error.message}`);
//         if (error.code === 'ENOENT') {
//             return res.status(404).json({ message: 'Image not found' });
//         }
//         return res.status(500).json({ message: error.message });
//     }
// };
// exports.deleteProduct = async function(req, res) {
//     try {
//         const productId = req.params.id;
//         if (!mongoose.isValidObjectId(productId)) {
//             return res.status(404).json('Invalid Product');
//         }
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         await media_helper.deleteImages(
//             [...product.images, product.image],
//             'ENOENT'
//         );

//         await Review.deleteMany({ _id: { $in: product.reviews } });

//         await Product.findByIdAndDelete(productId);
//         return res.status(204).end();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };

// exports.getProducts = async function(req, res) {
//     try {
//         const page = req.query.page || 1;
//         const pageSize = 10;
//         const products = await Product.find()
//             .select('-reviews -rating')
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (!products) {
//             return res.status(404).json({ message: 'Products not found' });
//         }
//         return res.json(products);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };


module.exports = {
    addProduct: async(req, res) => {
        const { title, productTags, category, code, vendor, description, time, price, additives, imageUrl } = req.body;

        if (!title || !productTags || !category || !code || !vendor || !description || !time || !price || !additives || !imageUrl) {
            return res.status(400).json({ status: false, message: "You have a missing field" });
        }

        try {
            const newProduct = new Product(req.body);

            await newProduct.save();

            res.status(201).json({ status: true, message: "Product has been successfully added" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getProductById: async(req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);

            res.status(200).json(Product);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomProduct: async(req, res) => {
        try {
            let randomProductList = [];

            // Check if code is provided in the params
            if (req.params.code) {
                randomProductList = await Product.aggregate([
                    { $match: { code: req.params.code } },
                    { $sample: { size: 3 } },
                    { $project: { __v: 0 } }
                ]);
            }

            // If no code provided in params or no Products match the provided code
            if (!randomProductList.length) {
                randomProductList = await Product.aggregate([
                    { $sample: { size: 3 } },
                    { $project: { __v: 0 } }
                ]);
            }

            // Respond with the results
            if (randomProductList.length) {
                res.status(200).json(randomProductList);
            } else {
                res.status(404).json({ status: false, message: 'No Products found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllProductsByCode: async(req, res) => {
        const code = req.params.code;

        try {
            const productList = await Product.find({ code: code });

            return res.status(200).json(productList);
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },
    //vendor Menu
    getProductsByVendor: async(req, res) => {
        const id = req.params.id;

        try {
            const products = await Product.find({ vendor: id });

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getProductsByCategoryAndCode: async(req, res) => {
        const { category, code } = req.params;
        try {
            const products = await Product.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $project: { __v: 0 } }
            ]);

            if (products.length === 0) {
                return res.status(200).json([]);
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },


    searchProducts: async(req, res) => {
        const search = req.params.search;

        try {
            const results = await Product.aggregate([{
                $search: {
                    index: "products",
                    text: {
                        query: search,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }])

            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomProductsByCategoryAndCode: async(req, res) => {
        const { category, code } = req.params;

        try {
            let products;

            products = await Product.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $sample: { size: 10 } },
            ])

            if (!products || products.length === 0) {
                products = await Product.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 10 } },
                ])
            } else if (!products || products.length === 0) {
                products = await Product.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 10 } },
                ])
            }
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    }




};