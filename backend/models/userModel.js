const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password should be greater than 4 characters"],
        select: false,
    },
    phone: {
        type: Number
    },
    address: [
        {
            country: {
                type: String,
            },
            city:{
                type: String,
            },
            address1:{
                type: String,
            },
            address2:{
                type: String,
            },
            zipCode:{
                type: Number,
            },
            addressType:{
                type: String,
            },
    }
    ],
    role: {
        type: String,
        default: 'user',
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    
});

module.exports = mongoose.model('User', userSchema);