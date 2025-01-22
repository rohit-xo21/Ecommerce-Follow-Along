const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://orimforai:Qwertyui12345678@cluster0.zmzuy.mongodb.net/ecommerce");
        console.log("MongoDB connected successfully");
    } catch(err) {
        console.log(err.message);
    }
}

module.exports = connectDB;