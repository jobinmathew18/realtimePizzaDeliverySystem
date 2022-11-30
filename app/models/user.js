const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passsword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'customer'
    }
}, {timestamps: true});                     //timestamp provides us the time at which data is stored in database.


module.exports = mongoose.model('User', userSchema);