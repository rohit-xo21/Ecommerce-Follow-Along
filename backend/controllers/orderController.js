const Order = require("../models/orderModel");
const User = require("../models/userModel");

const createOrder = async (req, res) => {
    try {
        const email = req.user.email;
        const { products, address } = req.body;
        
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   

        const userId = user._id;

        const orderItems = products.map(product => {
            return {
                product: product._id,
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                image: product.image
            };
        });
        
        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress: address,
            totalAmount
        });

        await order.save();

        res.status(201).json({
            message: "Order created successfully",
            orderId: order._id
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createOrder
};