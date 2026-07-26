import mongoose, { Schema } from "mongoose";
// import Users from "./Users.js";
const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice:{
        type:Number,
        required:true,
    },

    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true,
    },
    
    status:{
        type:String,
        enum:["Pending","Preparing","Out for Delivery","Delivered","Cancelled"],
        default:"Pending",
    },

},{ timestamps: true });

const Order=mongoose.model("Order",orderSchema);

export default Order;