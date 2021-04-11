const Bus = require('../models/bus') ;

module.exports.postaddBus = async (req , res , next) => {
    
    
    const name = req.body.name.toLowerCase() ;
    const number = req.body.number ;
    const type = req.body.type.toLowerCase() ;
    const cost = req.body.cost ;
    const to = req.body.to.toLowerCase() ;
    const from = req.body.from.toLowerCase() ;
    const persons = [] ;
    const capacity = Number(req.body.capacity) ;
    const timing = req.body.timing ;
    try
    {
        const bus = new Bus({
            name:name ,
            number : number ,
            type : type ,
            cost : cost ,
            to : to ,
            from : from ,
            persons : persons ,
            capacity : capacity ,
            timing : timing
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