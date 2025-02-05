const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const {upload} = require("../multer");
const bcrypt = require('bcrypt');
const ErrorHandler = require("../utils/ErrorHandler");

router.post("/signup",upload.single("file"), async(req,res)=>{
    const {name, email, password} = req.body;
    const userEmail = await User.findOne({email});
    if (userEmail) {
        return next(new ErrorHandler("User already exists", 400));
    }
    const filename = req.file.filename ;
    const fileUrl = path.join(filename);
    const hashedPassword = await bcrypt.hash(password,10);
    const user={
        name:name,
        email:email,
        password:hashedPassword,
        avatar: fileUrl,
    } ;
    console.log(user);
});

module.exports = router;
