const express = require('express') ;
const adminController = require('../controllers/admin') ;

const router = express.Router() ;

router.post('/add-bus' , adminController.postaddBus) ;

module.exports = router ;