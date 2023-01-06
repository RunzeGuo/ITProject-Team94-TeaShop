const express = require('express')
const path = require('path');
// create our Router object
const demoRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController')
// add a route to handle the GET request for all customer data
demoRouter.get('/customer', demoController.getAllCustomerData)
// add a route to handle the GET request for all item data
demoRouter.get('/item', demoController.getAllItemData)
// add a route to handle the GET request for all order data
demoRouter.get('/order', demoController.getAllOrderData)
// add a route to handle the GET request for all item data
demoRouter.get('/toppings', demoController.getAllToppingsData)
//go to the login page
//demoRouter.get('/login', demoController.getLoginPage)
//get login success page
demoRouter.get('/success', demoController.getSuccessPage)

// export the router
module.exports = demoRouter