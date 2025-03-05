const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const createOrder = async (req, res) => {
    try {
        const email = req.user.email;
        const { items, shippingAddressId, totalAmount } = req.body;
        
        // Find the user
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }  
        const userId = user._id;

        // Find the shipping address
        const shippingAddress = user.addresses.find((address) => address._id.toString() === shippingAddressId);
        if (!shippingAddress) {
            return res.status(404).json({ message: "Shipping address not found" });
        }

        // Validate shipping address has all required fields
        if (!shippingAddress.country || !shippingAddress.city || 
            !shippingAddress.address1 || !shippingAddress.zip || 
            !shippingAddress.type) {
            return res.status(400).json({ 
                message: "Incomplete shipping address information",
                requiredFields: [
                    "country", 
                    "city", 
                    "address1", 
                    "zip", 
                    "type"
                ]
            });
        }

        // Validate and prepare order items
        const orderItems = await Promise.all(items.map(async (item) => {
            // Validate product exists and has correct price
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            // Validate product stock
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            return {
                product: item.productId,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.images[0] 
            };
        }));

        // Create the order
        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress: {
                country: shippingAddress.country,
                city: shippingAddress.city,
                address1: shippingAddress.address1,
                address2: shippingAddress.address2 || '', // Optional field
                zipCode: shippingAddress.zip, // Note: changed from zipCode to zip
                addressType: shippingAddress.type // Note: changed from addressType to type
            },
            totalAmount,
            orderStatus: "Processing" 
        });

        // Save the order
        await order.save();

        // Update product stocks
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart items after successful order
        user.cart = [];
        await user.save();

        res.status(201).json({
            message: "Order created successfully",
            orderId: order._id
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message 
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Populate order items with product details
        const orders = await Order.find({ user: user._id })
            .populate({
                path: 'orderItems.product',
                select: 'name price images' // Select only necessary product fields
            })
            .sort({ createdAt: -1 }); // Sort by most recent first

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders
        });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const email = req.user.email;

        // Find the user
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the order and ensure it belongs to the user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: user._id 
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if order can be canceled
        if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
            return res.status(400).json({ 
                message: "This order cannot be canceled as it has already been shipped or delivered" 
            });
        }

        // Check if already canceled
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({ message: "Order is already canceled" });
        }

        // Update order status
        order.orderStatus = "Cancelled";
        await order.save();

        // Restore product stocks
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(200).json({ 
            message: "Order canceled successfully",
            order 
        });
    } catch (err) {
        console.error("Error canceling order:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const email = req.user.email;

        // Find the user
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the order and populate product details
        const order = await Order.findOne({ 
            _id: orderId, 
            user: user._id 
        }).populate({
            path: 'orderItems.product',
            select: 'name price images description'
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order details retrieved successfully",
            order
        });
    } catch (err) {
        console.error("Error fetching order details:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    cancelOrder,
    getOrderDetails
};