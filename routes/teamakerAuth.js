const passport = require('passport')
const express = require('express')
const router = express.Router()

/* For Login page */

//get teamaker login page
router.get('/teamakerLogin',function(req,res){
    res.render('restaurant_login', {flash: req.flash('error'), layout: "desktop_login"})
});

router.post('/teamakerLogin',
    passport.authenticate('local', {
        successRedirect: '/restaurant/new_order', failureRedirect: '/teamakerLogin', failureFlash: true
    })
)

module.exports = router