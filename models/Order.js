const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const orderSchema = new Schema({
    user : {
        type:mongoose.Types.ObjectId ,
        ref:'User' , 
        required:true
    } ,
    busNumber : {
        type : String ,
        required : true
    },
    paymentSuccess : {
        type:Boolean ,
        required : true 
    } ,
    paymentDetail : {
        type:Object
    } ,
    orderId : {
        type : String
    }
}) ;

module.exports = mongoose.model('Order' , orderSchema) ;