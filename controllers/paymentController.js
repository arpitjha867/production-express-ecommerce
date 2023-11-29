import {instance} from "../server.js"
import crypto from 'crypto'
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
//configure env
dotenv.config();

export const checkoutFunc = async (req,res) =>{
    try {
        const {cart,auth} = req.body;
        var total = 0;
        cart?.map(item=>{
            total+=item.price;
        })
        const options = {
            amount: Number(total*100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        // insert order in db with payment status as not payed
        const orderObject = await new orderModel({
            razorpayOrderId : order?.id,
            products : cart,
            buyer : auth
        }).save()
        res.status(200).json({
            success:true,
            order:{...order,cart,auth},
            orderObject
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error,
            message:'payments error'
        })
        
    }
} 

export const paymentVerification = async (req,res) =>{
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const body = razorpay_order_id + "|" + razorpay_payment_id;
    
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest("hex");
      const isAuthentic = expectedSignature === razorpay_signature;
    
      if (isAuthentic) {
        // Database comes here
        const orderFind = await orderModel.findOneAndUpdate({razorpayOrderId:razorpay_order_id},{
            payment : "Paid",
            razorpayPaymentId : razorpay_payment_id
        });
    }
    res.redirect(
      `https://thankful-frog-bandanna.cyclic.app/dashboard/user/orders`
    );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error,
            message:'payments error'
        })
        
    }
} 

export const getKey = async (req,res) =>{
    try {
        res.status(200).json({
            success:true,
            key : process.env.RAZORPAY_API_KEY
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error
        })
    }
}
