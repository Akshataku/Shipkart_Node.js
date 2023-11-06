const mongoose = require('mongoose');

const kartSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    productid : String,
    userid : String,
    item : String,
    price : Number,
    brand : String,
    imageUrl : String
});

module.exports = mongoose.model('Kart',kartSchema);