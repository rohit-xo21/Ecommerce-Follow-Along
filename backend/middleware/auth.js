const User = require("../models/userModel");

const protect = async (req, res, next) => {
    let token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);  
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    } 
};

module.exports = protect;
