const express = require("express");
const connectDB = require("../db/database");
require('dotenv').config();


const app = express();
const PORT = 2022;

app.use(express.json());

app.get('/', (req,res) => {
    res.send("Hello World")
})

app.use('/api/products', require('../routes/productRoute'));

app.use('/api/users', require('../routes/userRoute'));

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Listening to port ${PORT}`)
    } catch(err) {
        console.log("Server failed to start");
    }
})

