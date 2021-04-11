const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    } ,
    bookings : [
        {
           type : mongoose.Types.ObjectId ,
           ref : 'Bus' ,
           required : true 
        }
    ]
})

module.exports = mongoose.model("User", userSchema);