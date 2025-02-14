const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async function(req, res) {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword, // Store the hashed password
        });

        await newUser.save();
        res.status(201).json({ msg: 'User created successfully', user: newUser });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
}

const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid creditionals' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({message: "Login successful", token});



    } catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = { signup,login };

