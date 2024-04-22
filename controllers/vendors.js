const { Vendor } = require("../models/vendor");

exports.getVendors = async(_, res) => {
    try {

        const vendors = await Vendor.find().select('vendorName email id isAdmin')

        if (!vendors) {
            return res.status(404).json({ message: 'Vendor not found' })
        }
        return res.json(vendors);

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}

exports.getVendorById = async(req, res) => {
    try {

        const vendor = await Vendor.findById(req.params.id).select('-passwordHash -resetPasswordOtp -resetPasswordOtpExpires')
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' })
        }
        return res.json(vendor);

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}


exports.updateVendor = async(req, res) => {
    try {
        const { vendorName, email, phone } = req.body;
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id, { vendorName, email, phone }, { new: true } //get new information 
        );
        if (!vendor) {
            return res.status(500).json({ message: 'Vendor not found' });
        }
        vendor.passwordHash = undefined;
        return res.json(vendor)

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.addVendorProduct = async(_, res) => {

}