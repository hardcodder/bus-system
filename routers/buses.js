const express = require('express') ;
const busController = require('../controllers/buses') ;
const router = express.Router() ;

const authMiddleware = require('../middlewares/isAuth') ;

router.get('/getAllBuses' , busController.getAllBuses) ;

router.get('/checkAvailability/:number' , busController.checkAvailability) ;

router.post('/reserve' ,authMiddleware.isAuth , busController.addReservation) ;

router.post('/cancel-reservation' ,authMiddleware.isAuth , busController.removeReservation) ;

router.post('/getBusesForRoute' , busController.getBusesForRoute) ;

module.exports = router;