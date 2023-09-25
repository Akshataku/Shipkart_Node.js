const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    item : String,
    price: Number,
    brand: String
});

module.exports = mongoose.model('Product',productSchema);