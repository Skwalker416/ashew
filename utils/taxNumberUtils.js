const TaxNumber = require('../models/TaxNumber');

// Function to fetch valid tax numbers from MongoDB
const fetchValidTaxNumbers = async() => {
    try {
        const validTaxNumbers = await TaxNumber.find({}, { taxNumber: 1, _id: 0 });
        return validTaxNumbers.map(item => item.taxNumber);
    } catch (error) {
        console.error('Error fetching valid tax numbers:', error);
        return [];
    }
};

module.exports = { fetchValidTaxNumbers };