const Bus = require('../models/bus') ;

module.exports.postaddBus = async (req , res , next) => {
    
    
    const name = req.body.name ;
    const number = req.body.number ;
    const type = req.body.type ;
    const cost = req.body.cost ;
    const schedule = req.body.schedule ;
    const persons = [] ;
    const capacity = req.body.capacity ;

    try
    {
        const bus = new Bus({
            name:name ,
            number : number ,
            type : type ,
            cost : cost ,
            schedule : schedule ,
            persons : persons ,
            capacity : capacity 
        }) ;

        await bus.save() ;

        res.status(201).json({
            message:'Successfully added bus'
        }) ;
    }
    catch(err)
    {
        throw(err) ;
    }
}