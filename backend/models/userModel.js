const mongoose = require("mongoose");

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
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, "Please enter a valid email"],
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
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;