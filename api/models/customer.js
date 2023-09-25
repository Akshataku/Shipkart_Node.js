const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    name : String,
    email: String,
    address: String,
    phone_no: Number
});

module.exports = mongoose.model('Customer',customerSchema);
