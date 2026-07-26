import mongoose, { Schema } from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
         unique:true,
         required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
}, { timestamps: true });

const Users=mongoose.model("Users",userSchema);

export default Users;

