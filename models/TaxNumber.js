// models/TaxNumber.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxNumberSchema = new Schema({
    taxNumber: {
        type: String,
        required: true,
        unique: true
    }
});

const TaxNumber = mongoose.model('TaxNumber', taxNumberSchema);

module.exports = TaxNumber;