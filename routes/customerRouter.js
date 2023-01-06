const express = require('express')
const path = require('path');
// create our Router object
const customerRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController')
//import customer controller functions
const customerController = require('../controllers/customerController')
//get home page
customerRouter.get('/home', customerController.getHomePage)
// add a route to handle the GET request for all customer data
customerRouter.get('/customer', demoController.getAllCustomerData)

//get bubble tea menu
customerRouter.get('/bubbletea', customerController.getAllBubbleTea)

//get login success page
customerRouter.get('/success', demoController.getSuccessPage)

customerRouter.post('/customize/:name', customerController.getCustomized)

//post customized result
customerRouter.post('/CustomizeResults', customerController.sotreCustomizedResults)

//get cart info
customerRouter.get('/cart', customerController.getCart)

//post cart info
customerRouter.post('/cart', customerController.checkout)

//get orders
customerRouter.get('/orders', customerController.getOrders)

//get profile
customerRouter.get('/profile', customerController.getProfile)

//get reset password
customerRouter.get('/profile/resetpassword', customerController.getResetPassword)

//post reset password
customerRouter.post('/profile/resetpassword', customerController.resetPassword)

//delete account
customerRouter.get('/profile/deleteAccount', customerController.deleteAccount)

//signout
customerRouter.get('/profile/signout', customerController.signout)

// export the router
module.exports = customerRouter