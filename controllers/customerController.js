const { default: mongoose } = require('mongoose')
const path = require('path')
const Database = require('../models/database_schema')
const bcrypt = require('bcryptjs')
const { urlencoded } = require('express')
 

//get home page
const getHomePage = async (req, res, next) => {
    try {
       return res.render('customerHomePage', {amount: req.user.cart_amount})
    } catch (err) {
        return next(err)
    }
}
//get all the bubble tea drinks and ads
const getAllBubbleTea = async (req, res, next) => {
    try {
        const bubbleTea = await Database.bubbleTea.find().lean()
        return res.render('menu', {data: bubbleTea, amount: req.user.cart_amount})
    } catch (err) {
        return next(err)
    }
}
//get customized
const getCustomized = async (req, res, next) => {
    try {
        const bubbleTea = await Database.bubbleTea.findOne({name: req.params.name}).lean()
        
        return res.render('customize', {name: bubbleTea.name, prices: bubbleTea.prices, pic_link: bubbleTea.pic_link})
    } catch (err) {
        return next(err)
    }
}


//get cart
const getCart = async (req, res, next) => {
    try {
        let user = await Database.user.findOne({username: req.user.username}).lean()
        if(user.cart == ''){
           
            return res.render('emptycart')
        }else{
            return res.render('cart', {data: user.cart, total: user.cart_prices, totalamount: user.cart_amount})
        }
        
    } catch (err) {
        return next(err)
    }
}

//get orders
const getOrders = async (req, res, next) => {
    try {
        const CurrentOrder = await Database.order.find({customer_email: req.user.username, is_picked: false}).lean()
        const HisotryOrder = await Database.order.find({customer_email: req.user.username, is_picked: true}).lean()
        return res.render('orders', {current: CurrentOrder, history: HisotryOrder})
        
    } catch (err) {
        return next(err)
    }
}

//database updates until the end of the function, after order is saved, the databse will update the cart by post method in checkout page
const checkout = async (req, res, next) => {

    try {
        const user = await Database.user.findOne({username: req.user.username}).lean()
        let order = new Database.order()
        console.log(req.body)
        if(typeof req.body.name == 'string'){
            if(req.body.amount != 0){
                order.items_and_number.push({"name": req.body.name, "Ice": req.body.Ice, "Sugar": req.body.Sugar, "amount": req.body.amount, "pic_link": req.body.pic_link, "price": req.body.price[1]})
            }
            
            /** if(req.body.amount == 0){
                    await Database.user.remove({username: user.username, "cart.name" : req.body.name, "cart.Ice" : req.body.Ice, "cart.Sugar": req.body.Sugar})
                }else{
                    await Database.user.updateOne({username: user.username, "cart.name" : req.body.name, "cart.Ice" : req.body.Ice, "cart.Sugar": req.body.Sugar}, {$set: {"cart.$.amount": req.body.amount}})
                }*/
                
        }else{
                for(i=0; i<req.body.name.length; i++){
                    if(req.body.amount[i] != 0){
                        order.items_and_number.push({"name": req.body.name[i], "Ice": req.body.Ice[i], "Sugar": req.body.Sugar[i], "amount": req.body.amount[i], "pic_link": req.body.pic_link[i], "price": req.body.price[i*2+1]})
                    }
                   
                    /** 
                    if(req.body.amount[i] == 0){
                        await Database.user.remove({username: user.username, "cart.name" : req.body.name[i], "cart.Ice" : req.body.Ice[i], "cart.Sugar": req.body.Sugar[i]})
                    }else{
                        await Database.user.updateOne({username: user.username, "cart.name" : req.body.name[i], "cart.Ice" : req.body.Ice[i], "cart.Sugar": req.body.Sugar[i]}, {$set: {"cart.$.amount": req.body.amount[i]}})
                    }
                    */
                    
                   
                }
        }
        
        if(order.items_and_number.length != 0){
            order.order_number += Math.floor(Math.random() * 100)+1;
            order.total_price = req.body.totalprice
            order.customer_email = req.user.username
            order.customer_mobile = req.user.mobile
            order.customer_name = (req.user.first_name + req.user.last_name)
            order.id = order._id.toString()
            order.time_order_placed_string = order.time_order_placed.toString().slice(0, 21)
            await order.save()
        }
            
        
        
       await Database.user.updateOne({username: user.username}, {$set: {cart: '', cart_prices: 0, cart_amount: 0}})
        
        return res.redirect('/customer/orders')
     } catch (err) {
         return next(err)
     }
}

// the function to insert all customized data into mongoDB
const sotreCustomizedResults = async (req, res, next) => {
    try {
       let user = await Database.user.findOne({username: req.user.username})
       req.body.amount = parseInt(req.body.amount,10)
       req.body.prices = parseFloat(req.body.prices, 10)
        var find = false
       if(user.cart == ''){
        user.cart[0] = req.body
        user.cart_prices += req.body.prices
        user.cart_amount += 1
       }else{
        for(i=0;i<user.cart.length;i++){
            if(user.cart[i].name == req.body.name && user.cart[i].Ice == req.body.Ice && user.cart[i].Sugar == req.body.Sugar){
              
               await Database.user.updateOne({username: user.username, "cart.name" : user.cart[i].name, "cart.Ice" : user.cart[i].Ice, "cart.Sugar": user.cart[i].Sugar}, {$set: {"cart.$.amount": user.cart[i].amount + 1}})
                user.cart_prices += user.cart[i].prices
                user.cart_amount += 1
                find = true
            }
        }
        if(!find){
            user.cart.push(req.body)
            user.cart_prices += req.body.prices
            user.cart_amount += 1
        }
        

        }
       await user.save()
         return res.redirect('/customer/bubbletea')
     } catch (err) {
         return next(err)
     }
}

// get profile
const getProfile = async (req, res, next) => {

    try {
        return res.render('profile', {amount: req.user.cart_amount})
     } catch (err) {
         return next(err)
     }
}

//get reset password
const getResetPassword = async (req, res, next) => {

    try {
        return res.render('resetpassword', {flash: req.flash('error')})
     } catch (err) {
         return next(err)
     }
}
//post reset password
const resetPassword = async (req, res, next) => {
    
    try {
        input_original_password = req.body.original_password
        new_password = req.body.new_password
        confirm_password = req.body.confirmed_password
        
        user = await Database.user.findOne({username : req.user.username})
        validation_original = await bcrypt.compare(input_original_password, user.password)
        validation_original_new = await bcrypt.compare(new_password, user.password)
        
        const SALT_FACTOR = 10
        
        if(validation_original){
            if(!validation_original_new){
                if(new_password == confirm_password){
                    new_password = await bcrypt.hash(new_password, SALT_FACTOR)
                    await Database.user.updateOne({username : req.user.username},{ $set: {password : new_password}})
                    
                }else{
                    req.flash("error", "confirm password not match")
                    res.redirect("/customer/profile/resetpassword")
                    return next()
                }
                
            }else{
                req.flash("error", "password has not been changed")
                res.redirect("/customer/profile/resetpassword")
                return next()
            }
        }else{
            req.flash("error", "invalid original password")
            res.redirect("/customer/profile/resetpassword")
            return next()
        }
    } catch (err) {
        return next(err)
    }
    
    res.redirect("/customer/profile")
}
//delete account
const deleteAccount = async (req, res, next) => {
    try {
        const customer = await Database.user.deleteOne({username: req.user.username})
       
        return res.send('/customerLogin')
    } catch (err) {
        return next(err)
    }
}

//sign out
const signout = async (req, res, next) => {
    try {
       return res.send('/customerLogin')
    } catch (err) {
        return next(err)
    }
}

//get all the fruti tea
const getAllFruitTea = async (req, res, next) => {
    try {
        const fruitTea = await Database.fruitTea.find().lean()
        return res.send( {data: fruitTea})
    } catch (err) {
        return next(err)
    }
}
//get all fresh juice
const getAllFreshJuice = async (req, res, next) => {
    try {
        const freshJuice = await Database.freshJuice.find().lean()
        return res.send( {data: item})
    } catch (err) {
        return next(err)
    }
}

//get all cake & dessert
const getAllCake = async (req, res, next) => {
    try {
        const cake = await Database.cake.find().lean()
        return res.send( {data: cake})
    } catch (err) {
        return next(err)
    }
}
//get all snacks
const getAllSnacks = async (req, res, next) => {
    try {
        const snack = await Database.snack.find().lean()
        return res.send( {data: snack})
    } catch (err) {
        return next(err)
    }
}
//get bubble tea costomized choices
const getBubbleTeaCostmizedChoices = async (req, res, next) => {
    try{
        const bubbleTea = await Database.bubbleTea.find({name : req.bubbleTea.name}).lean()
        return res.send({data: bubbleTea.toppings})
    } catch(err){
        return next(err)
    }
}
//get fruit tea customized choices
const getFruitTeaCostmizedChoices = async (req, res, next) => {
    try{
        const FruitTea = await Database.fruitTea.find({name : req.fruitTea.name}).lean()
        return res.send({data: FruitTea.toppings})
    } catch(err){
        return next(err)
    }
}
//get fresh fruit customized choices
const getFreshJuiceCostmizedChoices = async (req, res, next) => {
    try{
        const freshJuice = await Database.freshJuice.find({name : req.freshJuice.name}).lean()
        return res.send({data: freshJuice.toppings})
    } catch(err){
        return next(err)
    }
}
//get cake customized choices
const getCakeCostmizedChoices = async (req, res, next) => {
    try{
        const cake = await Database.cake.find({name : req.cake.name}).lean()
        return res.send({data: cake.toppings})
    } catch(err){
        return next(err)
    }
}
//get snacks customized choices
const getSnackCostomizedChoices = async (req, res, next) => {
    try{
        const snack = await Database.snack.find({name : req.snack.name}).lean()
        return res.send({data: snack.toppings})
    } catch(err){
        return next(err)
    }
}

module.exports = {
    getAllBubbleTea,
    getAllFreshJuice,
    getAllFruitTea,
    getAllCake,
    getAllSnacks,
    getBubbleTeaCostmizedChoices,
    getFreshJuiceCostmizedChoices,
    getFruitTeaCostmizedChoices,
    getCakeCostmizedChoices,
    getHomePage,
   
   
    getCart,
    checkout,

    getProfile,
    getResetPassword,
    resetPassword,
   
    sotreCustomizedResults,
    getOrders,
    getCustomized,
    deleteAccount,
    signout
}