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
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;