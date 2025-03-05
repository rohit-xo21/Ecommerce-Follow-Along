const Order = require("../models/orderModel");
const User = require("../models/userModel");

const createOrder = async (req, res) => {
    try {
        const email = req.user.email;
        const { items, shippingAddressId, totalAmount } = req.body;
        
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   

        const userId = user._id;

        const orderItems = items.map(product => {
            return {
                product: product._id,
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                image: product.image
            };
        });

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress: shippingAddressId,
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

const getUserOrders = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await
        User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = await Order.find({ user: user._id });

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders
        });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createOrder,
    getUserOrders
};