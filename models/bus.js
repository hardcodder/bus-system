const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const busSchema = new Schema({
    name : {
        type : String ,
        required : true
    } ,
    type : {
        type : String ,
        required : true
    } ,
    number : {
        type : Number ,
        required : true
    } ,
    cost : {
        type : Number ,
        required : true
    } ,
    to : {
        type : String , 
        required : true
    }  ,
    from : {
        type : String ,
        required : true 
    } ,
    timing : {
        type : String ,
        required : true
    } ,
    persons : [
        {
            type : mongoose.Types.ObjectId ,
            ref : 'User' ,
            required : true 
        }
    ] ,
    capacity : {
        type : Number ,
        required : true
    }
}) ;

module.exports = mongoose.model('Bus' , busSchema) ;