const mongoose = require("mongoose");
const Product = require("./productModel");

function validatePassword(password) {
    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(){}<>?]/.test(password)
    );
}

function validateAge(dob) {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18;
}

const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['home', 'work', 'other'],
        default: 'home'
    }
}, { _id: true, timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only for non-Google users
        },
        validate: {
            validator: function(password) {
                if (this.googleId) return true; // Skip validation for Google users
                return validatePassword(password);
            },
            message: "Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
        },
    },
    addresses: [addressSchema],
    googleId: {
        type: String,
        sparse: true
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
                default: 1,
            },
        },
    ],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;