const express = require('express') ;
const mongoose = require('mongoose') ;
const bodyParser = require('body-parser') ;
const adminRoute = require('./routers/admin') ;
const busRoute = require('./routers/buses') ;
const app = express() ;

const MONGODB_URI = `mongodb+srv://Anshul:anshul@cluster0.pk8vb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.use(bodyParser.json()) ;

app.use('/admin' , adminRoute) ;
app.use(busRoute) ;

app.use((error , req , res , next) => {
    error.statusCode = error.statusCode || 500 ;
    console.log(error);
    res.json({
        error : error
    }) ;
})

mongoose.connect(MONGODB_URI , { useNewUrlParser: true,  useUnifiedTopology: true }).
then(result => {
    console.log('Connected');
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
