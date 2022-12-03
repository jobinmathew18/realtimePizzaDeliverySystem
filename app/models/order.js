const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,                  //linking order collection with user collection
        ref: 'User',
        required: true
    },
    customerName:{
        type: String,
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,    
        required: true
    },
    paymentType: {
        type: String,
        default: 'COD'
    },
    status: {
        type: String,
        default: 'Order_placed'
    }
}, {timestamps: true});                     //timestamp provides us the time at which data is stored in database.


module.exports = mongoose.model('Order', orderSchema);  