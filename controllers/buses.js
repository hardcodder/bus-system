const Bus = require('../models/bus') ;
const razorpay = require('razorpay') ;
const Order = require('../models/Order') ;
const User = require('../models/user');

const instance = new razorpay({
    key_id : 'rzp_test_lTU3DVbvidGbPW' ,
    key_secret : 'SoFsYterfaUybKSQel7uGO6r'
}) ;

module.exports.getAllBuses = async (req , res , next) => {
    try
    {
        const buses = await Bus.find() ;
        return res.status(200).json({
            buses :buses
        }) ;
    }
    catch(err)
    {
        throw(err) ;
    }
}

module.exports.checkAvailability = async (req , res , next) => {
    try{
        const number = req.params.number ;
        const bus = await Bus.findOne({number:number}) ;
        if(bus)
        {
            let available = bus.capacity - bus.persons.length ;
            return res.status(200).json({
                isAvailable : available > 0 ,
                availableSeats : available
            }) ;
        }
        else
        {
            res.status(404).json({
                error : "No bus with this number found"
            })
        }
    }
    catch(err)
    {
        throw(err) ;
    }
}

module.exports.addReservation = async (req , res , next) => {
    try
    {
        console.log('hello');
        //Secret we put in razorpay
        const SECRET = 'myBUS' ;

        const crypto = require('crypto')
    
        const shasum = crypto.createHmac('sha256', SECRET) ;
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')
    
        //if secret is matched
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit')
            // process it

            const orderId = req.body.payload.payment.entity.order_id ;
            //fetching the order from the orderId
            let order = await Order.findOne({orderId:orderId}) ;
            let number = order.busNumber ;
            let bus = await Bus.findOne({number:number}) ;
            if(bus)
            {
                let available = bus.capacity - bus.persons.length ;
                if(available == 0)
                {
                    
                }
                else
                {
                    const userId = order.user ;
                    let ind = bus.persons.findIndex(person => String(person) == String(userId)) ;
                    console.log(ind) ;
                    if(ind != -1)
                    {
                        
                    }
                    else
                    {
                        let persons = [...bus.persons] ;
                        persons.push(userId) ;
                        bus.persons = persons ;
                        bus = await bus.save() ;
                        let user = await User.findById(userId) ;
                        let bookings = [...user.bookings] ;
                        bookings.push(bus._id) ;
                        user.bookings = bookings ;
                        await user.save() ;
                    }
                }
            }
            else
            {
                
            }
            res.status(200).json({
                status : 'ok'
            }) ;
        } 
        else {
            // pass it
            res.status(200).json({
                status : 'ok'
            }) ;
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.removeReservation =async (req , res , next) => {
    try{
        const userId = req.user._id ;
        let user = await User.findById(userId) ;
        const number = req.body.number ;
        const bus = await Bus.findOne({number:number}) ;
        if(bus)
        {
            let ind = bus.persons.findIndex(person => String(person) == String(req.user._id)) ;
            if(ind == -1)
            {
                return res.status(404).json({
                    message: "Your seat is not reserved"
                })
            }
            else
            {
                let persons = [...bus.persons] ;
                persons = persons.filter(person => String(person) != String(req.user._id)) ;
                bus.persons = persons;
                await bus.save() ;
                let bookings = [...user.bookings] ;
                bookings = bookings.filter(booking => String(booking) != String(bus._id)) ;
                user.bookings = bookings ;
                await user.save() ;
                return res.status(201).json({
                    message : "Your reservation is cancelled" 
                })
            }
            
        }
        else
        {
            return res.status(404).json({
                message : "No bus with this number found"
            })
        }
    }
    catch(err)
    {
        throw(err) ;
    }
}

module.exports.getBusesForRoute = async (req , res , next) => {
    try
    {
        const to = req.body.to.toLowerCase() ;
        const from = req.body.from.toLowerCase() ;
        let buses = await Bus.find({to:to , from :from}) ;
        let modifiedBuses = buses.map(bus => {
            return {
                ...bus._doc ,
                available : bus._doc.capacity - bus._doc.persons.length
            }
        })
        console.log(modifiedBuses);
        return res.render('busViews/searchBus', {
            path: '/searchBus',
            title: 'Search Bus' ,
            buses:modifiedBuses ,
            isAuthenticated : req.user
        });
    }
    catch(err)
    {
        throw(err) ;
    }
}

module.exports.postRazorpay = async (req , res , next) => {
    try
    {
        //this route will be called after clicking the payment

        const number = req.body.number ;
        const userId = req.user._id ;
        const cost = req.body.cost ;
        console.log(number);
        const bus = await Bus.findOne({number:number}) ;
        console.log(bus) ;

        if(bus)
        {
            let available = bus.capacity - bus.persons.length ;
            if(available == 0)
            {
                res.status(400).json({
                    message : "No seats left in bus"
                })
            }
            else
            {
                const userId = req.user._id ;
                let ind = bus.persons.findIndex(person => String(person) == String(userId)) ;
                console.log(ind) ;
                if(ind == -1)
                {
                    //we are creating a new order associated to it
                    //we are setting the paymentSuccess to be false
                    let order = new Order({
                        busNumber : number ,
                        user : userId ,
                        paymentSuccess : false
                    }) ;

                    order = await order.save() ;

                    const payment_capture = 1 ;

                    //setting the amount according to the bus
                    const amount = Number(cost)  ;
                
                    const options = {amount : (amount*100).toString()
                        , currency : "INR"
                        , receipt : order._id.toString()
                        , payment_capture
                        } ;
                
                    //this is a razorpay feature
                    const response = await instance.orders.create(options) ;
                    
                    order.orderId = response.id ;
                    await order.save() ;
                    return res.status(200).json({
                        id:response.id ,
                        currency : response.currency ,
                        amount : response.amount ,
                        name:(req.user.name) ,
                        email:req.user.email ,
                        receipt : response.receipt
                    });
                }
                else
                {
                    res.status(400).json({
                        error : "Your seat is reserved"
                    })
                }
            }
        }
        else
        {
            res.status(404).json({
                error : "No bus with this number found"
            })
        }
        
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            error : "error"
        })
    }   
}

module.exports.getBookings = async (req , res , next) => {
    try
    {
        const userId = req.user._id ;
        let user = await User.findById(userId).populate('bookings') ;
        console.log(user);
        let errMessage = "" ;
        return res.render('busViews/manageBookings.ejs', {
            path: '/manageBookings',
            title: 'Manage Bookings',
            errMessage: errMessage ,
            isAuthenticated : req.user ,
            bookings : user.bookings
        })
    }
    catch(err)
    {
        console.log(err);
    }
}