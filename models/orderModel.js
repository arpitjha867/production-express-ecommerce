import mongoose from "mongoose";
import productModel from "./productModel.js";

const orderSchema = mongoose.Schema({
    razorpayOrderId : {
        type:String,
        required : true
    },
    products:[{
        type:mongoose.ObjectId,
        ref:"products"
    }],
    payment : {
        type :String,
        default : "Not paid",
        enum : ["Not paid","Paid"],
    },
    buyer : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : "Not processed",
        enum : ["Not processed","Processing","Delivered","Canceled"]
    },
    razorpayPaymentId : {
        type : String
    }
},{timestamps : true})


export default mongoose.model("orders",orderSchema);