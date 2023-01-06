const passport = require('passport')
const express = require('express')
const router = express.Router()

const demoController = require("../controllers/demoController");
const { connection } = require('mongoose');

/* For Login page */

//get customer login page
router.get('/customerLogin',function(req,res){
    res.render('customerLogin', {flash: req.flash('error'), layout: "login"})
});

router.post('/customerLogin',
    passport.authenticate('local', {
        successRedirect: '/customer/home', failureRedirect: '/customerLogin', failureFlash: true
    })
)

/* For the customer register page */
router.get('/customerregister', demoController.customer_register_get)
router.post('/customerregister', demoController.customer_register_post)

module.exports = router