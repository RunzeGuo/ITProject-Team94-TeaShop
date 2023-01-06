const { default: mongoose } = require('mongoose')
const path = require('path')
const Database = require('../models/database_schema')
const bcrypt = require('bcryptjs')
const req = require('express/lib/request')

const getAllCustomerData = async (req, res, next) => {
    try {
        const customer = await Database.user.find().lean()
        return res.send( {data: customer} )
    } catch (err) {
        return next(err)
    }
}

//const getLoginPage = async (req, res, next) => {
 //   return res.sendFile(path.join(__dirname+'/views/aboutwebsit.html')
    
//}

const getSuccessPage = async (req, res, next) => {
    return res.sendFile('/Users/dongjiaheng/ITProject-Team94/itdemo/views/success.html');
}

const getAllItemData = async (req, res, next) => {
    try {
        const item = await Database.item.find().lean()
        return res.send( {data: item})
    } catch (err) {
        return next(err)
    }
}
const getAllOrderData = async (req, res, next) => {
    try {
        const order = await Database.order.find().lean()
        return res.send( {data: order})
    } catch (err) {
        return next(err)
    }
}
const getAllToppingsData = async (req, res, next) => {
    try {
        const toppings = await Database.toppings.find().lean()
        return res.send( {data: toppings})
    } catch (err) {
        return next(err)
    }
}

/* For the customer register page*/
const customer_register_get = async(req, res, next) => {
    return res.render('customerregister')
}

const customer_register_post = async (req, res, next) => {
    try {
        var newCustomer= new Database.user(req.body)

        await newCustomer.save()
        // Go back to dashboard
        return res.redirect('/customerLogin')
    } catch (err) {
        //return res.redirect('/clinician/dashboard')
        return next(err)
    }
}

module.exports = {
    getAllCustomerData,
    getAllItemData,
    getAllOrderData,
    getAllToppingsData,
    //getLoginPage,
    customer_register_get,
    customer_register_post,
    getSuccessPage
}