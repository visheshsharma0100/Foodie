import express from "express";
import Order from "../Models/Order.js";
import AdminMiddleware from "../Middleware/AdminMiddleware.js";
import AuthMiddleware from "../Middleware/AuthMiddleware.js";
import Food from "../Models/Food.js";
const router = express.Router();

// Place Order
router.post("/place", AuthMiddleware, async (req, res) => {
    try {
        const id = req.user.id;
        const { items, address, phone, paymentMethod } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must include at least one item." });
        }
        if (!address?.trim() || !phone?.trim()) {
            return res.status(400).json({ message: "Delivery address and phone are required." });
        }
        if (!["COD", "Online"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method." });
        }

        const orderItems = [];
        let totalPrice = 0;

        for (const item of items) {
            if (!item?.foodId || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 20) {
                return res.status(400).json({ message: "Each item must have a valid food ID and quantity between 1 and 20." });
            }
            const food = await Food.findById(item.foodId);
            if (!food || food.isAvailable === false) {
                return res.status(400).json({
                    message: food ? `${food.name} is currently unavailable.` : "One or more items are invalid.",
                });
            }
            const quantity = Number(item.quantity);
            orderItems.push({
                foodId: food._id,
                name: food.name,
                price: food.price,
                quantity,
            });
            totalPrice += food.price * quantity;
        }

        const newOrder = new Order({
            userId: id,
            items: orderItems,
            address: address.trim(),
            phone: phone.trim(),
            paymentMethod,
            totalPrice,
        });
        await newOrder.save();

        return res.status(201).json({
            message: "Order Placed",
            order: newOrder,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});

// Get my Order
router.get("/my-orders", AuthMiddleware, async (req, res) => {
    try {
        const id = req.user.id;
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Your Order Summary",
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});

// Get ALL Order (Admin)
router.get("/all-orders", AuthMiddleware, AdminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});

// status (update-order)
router.put("/status/:id", AuthMiddleware, AdminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const allowed = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
        if (status && !allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid order status." });
        }
        const updateStatus = await Order.findByIdAndUpdate(
            id,
            status ? { status } : req.body,
            { new: true }
        );
        if (!updateStatus) {
            return res.status(404).json({
                message: "Order Not found",
            });
        }
        return res.status(200).json({
            message: "Status Updated",
            order: updateStatus,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});

export default router;
