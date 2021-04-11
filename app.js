const express = require('express') ;

const mongoose = require('mongoose') ;

const bodyParser = require('body-parser') ;

const path = require("path") ;

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const adminRoute = require('./routers/admin') ;
const busRoute = require('./routers/buses') ;
const authRoute = require('./routers/auth');
const indexRoute = require('./routers/index') ;

const MONGODB_URI = `mongodb+srv://myBus:mybus@cluster0.f8xh1.mongodb.net/Bus-Station?retryWrites=true&w=majority`;

const app = express() ;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(bodyParser.json()) ;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname ,'public'))) ;

app.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false ,
        store: store
    })
);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(async (req , res , next) => {
    if(req.session.user)
    {
        const id = req.session.user._id ;
        const user = await User.findById(id) ;
        if(user)
        {
            req.user = user ;
        }
    }
    // const user = await User.findOne({email : 'dhiman.anshul863@gmail.com'}) ;
    // req.user = user ;
    next() ;
})


app.use('/admin' , adminRoute) ;
app.use(busRoute) ;
app.use(authRoute);
app.use(indexRoute) ;

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
