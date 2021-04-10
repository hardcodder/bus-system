const express = require('express') ;
const busController = require('../controllers/buses') ;
const router = express.Router() ;

router.get('/getAllBuses' , busController.getAllBuses) ;

router.get('/checkAvailability/:number' , busController.checkAvailability) ;

router.post('/reserve' , busController.addReservation) ;

router.post('/cancel-reservation' , busController.removeReservation) ;

module.exports = router;