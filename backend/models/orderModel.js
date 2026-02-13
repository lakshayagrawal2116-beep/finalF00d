import mongoose from "mongoose"
import coupon from "./coupon.js";

const orderSchema =new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    // data:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    couponCode:{type:String},
    discountAmount:{type:Number,default:0}
    
},{timestamps:true})
const orderModel=mongoose.models.order || mongoose.model("order",orderSchema);

export default orderModel;