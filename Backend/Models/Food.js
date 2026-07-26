import mongoose, { Schema } from "mongoose";
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    isVeg: {
        type: Boolean,
        required: true,
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Food=mongoose.model("Food",foodSchema);

export default Food