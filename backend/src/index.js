const express = require("express");
const connectDB = require("../config/db");
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = 2022;

app.use(express.json());


app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));



app.get('/', (req,res) => {
    res.send('Hello World');
    
})

app.use('/api/products', require('../routes/productRoute'));

app.use('/api/users', require('../routes/userRoute'));



app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Listening to port http://localhost:${PORT}`)
    } catch(err) {
        console.log("Server failed to start");
    }
})

