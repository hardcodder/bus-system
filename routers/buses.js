const express = require('express') ;
const busController = require('../controllers/buses') ;
const router = express.Router() ;

const authMiddleware = require('../middlewares/isAuth') ;

router.get('/getAllBuses' , busController.getAllBuses) ;

router.get('/checkAvailability/:number' , busController.checkAvailability) ;

router.post('/reserve' , busController.addReservation) ;

router.post('/cancel-reservation' ,authMiddleware.isAuth , busController.removeReservation) ;

router.post('/getBusesForRoute' , busController.getBusesForRoute) ;

router.post('/razorpay' ,authMiddleware.isAuth , busController.postRazorpay) ;

router.get('/getBookings' ,authMiddleware.isAuth , busController.getBookings) ;

module.exports = router;