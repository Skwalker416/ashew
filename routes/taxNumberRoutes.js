// routes/taxNumber.js
const express = require('express');
const router = express.Router();
const TaxNumber = require('../models/TaxNumber');

// Route to add tax numbers
router.post('/taxNumbers', async(req, res) => {
    try {
        const { taxNumber } = req.body;
        const existingTaxNumber = await TaxNumber.findOne({ taxNumber });
        if (existingTaxNumber) {
            return res.status(400).json({ message: 'Tax number already exists' });
        }

        const newTaxNumber = new TaxNumber({ taxNumber });
        await newTaxNumber.save();

        return res.status(201).json({ message: 'Tax number added successfully' });
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
});

module.exports = router;