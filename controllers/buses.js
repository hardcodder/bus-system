const Bus = require('../models/bus') ;

module.exports.getAllBuses = async (req , res , next) => {
    try
    {
        const buses = await Bus.find() ;
        res.status(200).json({
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
            res.status(200).json({
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
    try{
        const number = req.body.number ;
        const bus = await Bus.findOne({number:number}) ;
        if(bus)
        {
            let available = bus.capacity - bus.persons.length ;
            if(available == 0)
            {
                res.status(404).json({
                    error : "No seats available"
                })
            }
            else
            {
                const userId = req.user._id ;
                let ind = bus.persons.findIndex(person => String(person) == String(userId)) ;
                console.log(ind) ;
                if(ind != -1)
                {
                    res.status(200).json({
                        message : "You have already reserved your seat"
                    })
                }
                else
                {
                    let persons = [...bus.persons] ;
                    persons.push(userId) ;
                    bus.persons = persons ;
                    await bus.save() ;
                    res.status(201).json({
                        message : "Your seat is reserved"
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
        throw(err) ;
    }
}

module.exports.removeReservation =async (req , res , next) => {
    try{
        const number = req.body.number ;
        const bus = await Bus.findOne({number:number}) ;
        if(bus)
        {
            let ind = bus.persons.findIndex(person => String(person) == String(req.user._id)) ;
            if(ind == -1)
            {
                res.status(404).json({
                    error: "Your seat is not reserved"
                })
            }
            else
            {
                let persons = [...bus.persons] ;
                persons = persons.filter(person => String(person) != String(req.user._id)) ;
                bus.persons = persons;
                await bus.save() ;
                res.status(201).json({
                    message : "Your reservation is cancelled" 
                })
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
        throw(err) ;
    }
}

module.exports.getBusesForRoute = async (req , res , next) => {
    try
    {
        const to = req.body.to ;
        const from = req.body.from ;
        const buses = await Bus.find({to:to , from :from}) ;
        res.json({
            buses : buses
        }) ;
    }
    catch(err)
    {
        throw(err) ;
    }
}