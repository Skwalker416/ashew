const { Vendor } = require("../../models/vendor");
const { Product } = require('../../models/product');
// const { Review } = require('../../models/review');
const media_helper = require('../../helpers/media_helper')
const util = require('util');
const { Category } = require('../../models/category');
const multer = require('multer');
const { isArrayBufferView } = require('util/types');
const { default: mongoose } = require('mongoose');

// exports.getVendorById = async(req, res) => {
//     try {

//         const vendor = await Vendor.findById(req.params.id).select('-passwordHash -resetPasswordOtp -resetPasswordOtpExpires')
//         if (!vendor) {
//             return res.status(404).json({ message: 'Vendor not found' })
//         }
//         return res.json(vendor);

//     } catch (error) {
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// }


// exports.updateVendor = async(req, res) => {
//     try {
//         const { vendorName, email, phone } = req.body;
//         const vendor = await Vendor.findByIdAndUpdate(
//             req.params.id, { vendorName, email, phone }, { new: true } //get new information 
//         );
//         if (!vendor) {
//             return res.status(500).json({ message: 'Vendor not found' });
//         }
//         vendor.passwordHash = undefined;
//         return res.json(vendor)

//     } catch (error) {
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };

// exports.getVendors = async(_, res) => {
//     try {

//         const vendors = await Vendor.find().select('vendorName email id isAdmin')

//         if (!vendors) {
//             return res.status(404).json({ message: 'Vendor not found' })
//         }
//         return res.json(vendors);

//     } catch (error) {
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };

exports.addVendor = async(req, res) => {
        const { title, time, imageUrl, owner, code, logoUrl, coords } = req.body;

        if (!title || !time || !imageUrl || !owner || !code || !logoUrl || !coords ||
            !coords.latitude || !coords.longitude || !coords.address || !coords.title) {
            return res.status(400).json({ status: false, message: "You have a missing field" });
        }

        try {
            const newVendor = new Vendor(req.body);

            await newVendor.save();
            res.status(201).json({ status: true, message: "Vendor has been successfully" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    exports.getVendorById = async(req, res) => {
        const id = req.params.id;
        try {
            const vendor = await Vendor.findById(id);

            res.status(200).json(vendor);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    exports.getRandomVendors = async(req, res) => {
        const code = req.params.code;
        try {
            let randomVendor = [];

            if (code) {
                randomVendor = await Vendor.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }

            if (randomVendor.length === 0) {
                randomVendor = await Vendor.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }

            res.status(200).json(randomVendor);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    };