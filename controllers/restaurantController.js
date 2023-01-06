const database = require("../models/database_schema")
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose")

const path = require('path')
const fs = require('fs')

var ImageKit = require("imagekit");

var imagekit = new ImageKit({

    publicKey: "public_MTwbUZYwhoxLNZJIb8IKQ6PdMDM=",
    privateKey: "private_YC9vWAzwr01LNEaCpY4Fogc7enI=",
    urlEndpoint: "https://ik.imagekit.io/dmczcapad"

});

const home_page_GET = async (req, res, next) => {
    try {
        let all_unpicked_order = await database.order.find({ is_picked: false }).sort({ time_order_placed: 1 })
        let order_summary = cur_order_statistic(all_unpicked_order)

    } catch (err) {
        next(err)
    }
}

const new_order_page_GET = async (req, res, next) => {
    try {
        let all_unpicked_order = await database.order.find({ is_picked: false }).lean().sort({ time_order_placed: 1 })
        let order_summary = cur_order_statistic(all_unpicked_order)

        res.render("new_order", { new_order: order_summary[1], title: "New Order", layout: "order_layout" })
    } catch (err) {
        next(err)
    }
}

// POST function to accept a order 
const new_order_page_accept_POST = async (req, res, next) => {
    try {
        await database.order.updateOne({ id: req.params.id }, { $set: { is_accepted: true, time_order_accepted_or_rejected: new Date(), time_order_accepted_or_rejected_string: new Date().toString().slice(0, 21) } })
        res.redirect("/restaurant/new_order")
    } catch (err) {
        next(err)
    }
}

// POST function to reject a order 
const new_order_page_reject_POST = async (req, res, next) => {
    try {
        await database.order.updateOne({ id: req.params.id }, { $set: { is_rejected: true, time_order_accepted_or_rejected: new Date(), time_order_accepted_or_rejected_string: new Date().toString().slice(0, 21) } })
        res.redirect("/restaurant/new_order")
    } catch (err) {
        next(err)
    }
}

// GET function to show orders under processing
const order_processing_page_GET = async (req, res, next) => {
    try {
        let all_unpicked_order = await database.order.find({ is_picked: false }).lean().sort({ time_order_placed: 1 })
        let order_summary = cur_order_statistic(all_unpicked_order)

        res.render("in_progress", { new_order: order_summary[3], title: "In Progress", layout: "order_layout" })
    } catch (err) {
        next(err)
    }
}

// POST function to finish a order
const order_processing_page_finished_POST = async (req, res, next) => {
    try {
        await database.order.updateOne({ id: req.params.id }, { $set: { is_finished: true, time_order_finished: new Date(), time_order_finished_string: new Date().toString().slice(0, 21) } })
        res.redirect("/restaurant/processing_order")
    } catch (err) {
        next(err)
    }
}

// GET function to show orders ready for pick up
const finished_order_page_GET = async (req, res, next) => {
    try {
        let all_unpicked_order = await database.order.find({ is_picked: false }).lean().sort({ time_order_placed: 1 })
        let order_summary = cur_order_statistic(all_unpicked_order)

        res.render("finished_order", { new_order: order_summary[5], title: "Ready", layout: "order_layout" })
    } catch (err) {
        next(err)
    }
}

// POST function to finish a order
const finished_order_page_picked_POST = async (req, res, next) => {
    try {
        await database.order.updateOne({ id: req.params.id }, { $set: { is_picked: true, time_order_picked: new Date(), time_order_picked_string: new Date().toString().slice(0, 21) } })
        res.redirect("/restaurant/finished_order")
    } catch (err) {
        next(err)
    }
}

const restaurant_password_reset_page_GET = async (req, res, next) => {
    try {
        res.render("restaurant_reset_password.hbs", { title: "Reset Password", flash: req.flash('error'), layout: "order_layout" })
    } catch (err) {
        next(err)
    }
}

const restaurant_password_reset_page_POST = async (req, res, next) => {
    try {
        input_original_password = req.body.original_password
        new_password = req.body.new_password
        confirm_password = req.body.confirmed_password

        user = await database.user.findOne({ username: req.user.username })

        validation_original = await bcrypt.compare(input_original_password, user.password)
        validation_original_new = await bcrypt.compare(new_password, user.password)

        const SALT_FACTOR = 10

        if (validation_original) {
            if (!validation_original_new) {
                if (new_password == confirm_password) {
                    new_password = await bcrypt.hash(new_password, SALT_FACTOR)
                    await database.user.updateOne({ username: req.user.username }, { $set: { password: new_password } })

                } else {
                    req.flash("error", "confirm password not match")
                    res.redirect("/restaurant/reset_password")
                    return next()
                }

            } else {
                req.flash("error", "password has not been changed")
                res.redirect("/restaurant/reset_password")
                return next()
            }
        } else {
            req.flash("error", "invalid original password")
            res.redirect("/restaurant/reset_password")
            return next()
        }
    } catch (err) {
        return next(err)
    }

    req.flash("error", "password is changed successfully")
    res.redirect("/restaurant/reset_password")
}

/* This function would accept a list of all unpicked order and return a list contain 
[the number of new order, the detail of new orders, the number of unfinished orders, the detail of unfinished orders, the number of unpicked orders, the detail of unpicked orders] */
function cur_order_statistic(all_unpicked_order) {
    let new_order_num = 0
    let under_progress_order_num = 0
    let ready_order_number = 0

    let new_order_list = []
    let under_progress_order_list = []
    let ready_order_list = []

    for (var i = 0, len = all_unpicked_order.length; i < len; i++) {
        var cur_order = all_unpicked_order[i]
        if ((cur_order.is_accepted == false) && (cur_order.is_rejected == false)) {
            new_order_num++
            new_order_list.push(cur_order)
        } else if ((cur_order.is_accepted == true) && (cur_order.is_finished == false)) {
            under_progress_order_num++
            under_progress_order_list.push(cur_order)
        } else if ((cur_order.is_finished == true) && (cur_order.is_picked == false)) {
            ready_order_number++
            ready_order_list.push(cur_order)
        }
    }

    return [new_order_num, new_order_list, under_progress_order_num, under_progress_order_list, ready_order_number, ready_order_list]
}

/* GET function for showing all items in menu bubble tea*/
const menu_bubble_tea_GET = async (req, res, next) => {
    try {
        let bubble_tea = await database.bubbleTea.find().lean()

        res.render("menu_bubble_tea", { current_menu: bubble_tea, title: "Menu Bubble Tea", layout: "adjust_menu_layout" })
    } catch (err) {
        next(err)
    }
}

/* POST function for add a new item to menu bubble tea */
const menu_bubble_tea_add_item_POST = async (req, res, next) => {
    try {
        let new_item = new database.bubbleTea(req.body)
        let id = new_item._id.toString()
        new_item.id = id

        let extname = path.extname(req.file.originalname)
        let filename = id + extname
        imagekit.upload({
            file: req.file.buffer, //required
            fileName: filename,   //required
        }, async function (error, result) {
            if (error) { console.log(error) }
            else {
                new_item.pic_link = result.url
                new_item.file_id = result.fileId
                await new_item.save()
                res.redirect("/restaurant/menu_bubble_tea")
            }

        });

    } catch (err) {
        next(err)
    }
}

/* POST function for update a item in menu bubble tea*/
const menu_bubble_tea_change_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        await database.bubbleTea.updateOne({ id: item_id }, { $set: req.body })

        res.redirect("/restaurant/menu_bubble_tea")
    } catch (err) {
        next(err)
    }
}

/* POST function for delect a item in menu bubble tea*/
const menu_bubble_tea_delect_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id
        let item = await database.bubbleTea.findOne({ id: item_id }).lean()
        let file_id = item.file_id

        imagekit.deleteFile(file_id, function (error, result) {
            if (error) console.log(error);
            else;
        });

        await database.bubbleTea.deleteOne({ id: item_id })

        res.redirect("/restaurant/menu_bubble_tea")
    } catch (err) {
        next(err)
    }
}

/* GET function for showing all items in menu fruit tea*/
const menu_fruit_tea_GET = async (req, res, next) => {
    try {
        let fruit_tea = await database.fruitTea.find().lean()

        res.render("menu_fruit_tea", { current_menu: fruit_tea, title: "Menu Fruit Tea", layout: "adjust_menu_layout" })
    } catch (err) {
        next(err)
    }
}

/* POST function for add a new item to menu fruit tea */
const menu_fruit_tea_add_item_POST = async (req, res, next) => {
    try {
        let new_item = new database.fruitTea(req.body)
        let id = new_item._id.toString()
        new_item.id = id
        let extname = path.extname(req.file.originalname)
        let filename = id + extname
        imagekit.upload({
            file: req.file.buffer, //required
            fileName: filename,   //required
        }, async function (error, result) {
            if (error) { console.log(error) }
            else {
                new_item.pic_link = result.url
                new_item.file_id = result.fileId
                await new_item.save()
                res.redirect("/restaurant/menu_fruit_tea")
            }

        });
        
    } catch (err) {
        next(err)
    }
}

/* POST function for update a item in menu fruit tea*/
const menu_fruit_tea_change_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        await database.fruitTea.updateOne({ id: item_id }, { $set: req.body })

        res.redirect("/restaurant/menu_fruit_tea")
    } catch (err) {
        next(err)
    }
}

/* POST function for delect a item in menu fruit tea*/
const menu_fruit_tea_delect_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        let item = await database.fruitTea.findOne({ id: item_id }).lean()
        let file_id = item.file_id

        imagekit.deleteFile(file_id, function (error, result) {
            if (error) console.log(error);
            else;
        });

        await database.fruitTea.deleteOne({ id: item_id })

        res.redirect("/restaurant/menu_fruit_tea")
    } catch (err) {
        next(err)
    }
}

/* GET function for showing all items in menu fresh juice tea*/
const menu_fresh_juice_GET = async (req, res, next) => {
    try {
        let fresh_juice = await database.freshJuice.find().lean()

        res.render("menu_fresh_juice", { current_menu: fresh_juice, title: "Menu Fresh Juice", layout: "adjust_menu_layout" })
    } catch (err) {
        next(err)
    }
}

/* POST function for add a new item to menu fresh juice tea */
const menu_fresh_juice_add_item_POST = async (req, res, next) => {
    try {
        let new_item = new database.freshJuice(req.body)
        let id = new_item._id.toString()
        new_item.id = id
        let extname = path.extname(req.file.originalname)
        let filename = id + extname
        imagekit.upload({
            file: req.file.buffer, //required
            fileName: filename,   //required
        }, async function (error, result) {
            if (error) { console.log(error) }
            else {
                new_item.pic_link = result.url
                new_item.file_id = result.fileId
                await new_item.save()
                res.redirect("/restaurant/menu_fresh_juice")
            }

        });

    } catch (err) {
        next(err)
    }
}

/* POST function for update a item in menu fresh juice tea*/
const menu_fresh_juice_change_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        await database.freshJuice.updateOne({ id: item_id }, { $set: req.body })

        res.redirect("/restaurant/menu_fresh_juice")
    } catch (err) {
        next(err)
    }
}

/* POST function for delect a item in menu fresh juice tea*/
const menu_fresh_juice_delect_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        let item = await database.freshJuice.findOne({ id: item_id }).lean()
        let file_id = item.file_id

        imagekit.deleteFile(file_id, function (error, result) {
            if (error) console.log(error);
            else;
        });

        await database.freshJuice.deleteOne({ id: item_id })

        res.redirect("/restaurant/menu_fresh_juice")
    } catch (err) {
        next(err)
    }
}

/* GET function for showing all items in menu cake*/
const menu_cakes_GET = async (req, res, next) => {
    try {
        let cakes = await database.cake.find().lean()

        res.render("menu_cakes", { current_menu: cakes, title: "Menu Cakes", layout: "adjust_menu_layout" })
    } catch (err) {
        next(err)
    }
}

/* POST function for add a new item to menu cake */
const menu_cakes_add_item_POST = async (req, res, next) => {
    try {
        let new_item = new database.cake(req.body)
        let id = new_item._id.toString()
        new_item.id = id
        let extname = path.extname(req.file.originalname)
        let filename = id + extname
        imagekit.upload({
            file: req.file.buffer, //required
            fileName: filename,   //required
        }, async function (error, result) {
            if (error) { console.log(error) }
            else {
                new_item.pic_link = result.url
                new_item.file_id = result.fileId
                await new_item.save()
                res.redirect("/restaurant/menu_cakes")
            }

        });

    } catch (err) {
        next(err)
    }
}

/* POST function for update a item in menu cake*/
const menu_cakes_change_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        await database.cake.updateOne({ id: item_id }, { $set: req.body })

        res.redirect("/restaurant/menu_cakes")
    } catch (err) {
        next(err)
    }
}

/* POST function for delect a item in menu cake*/
const menu_cakes_delect_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        let item = await database.cake.findOne({ id: item_id }).lean()
        let file_id = item.file_id

        imagekit.deleteFile(file_id, function (error, result) {
            if (error) console.log(error);
            else;
        });

        await database.cake.deleteOne({ id: item_id })

        res.redirect("/restaurant/menu_cakes")
    } catch (err) {
        next(err)
    }
}

/* GET function for showing all items in menu snacks*/
const menu_snacks_GET = async (req, res, next) => {
    try {
        let snacks = await database.snack.find().lean()

        res.render("menu_snacks", { current_menu: snacks, title: "Menu Snacks", layout: "adjust_menu_layout" })
    } catch (err) {
        next(err)
    }
}

/* POST function for add a new item to menu snacks */
const menu_snacks_add_item_POST = async (req, res, next) => {
    try {
        let new_item = new database.snack(req.body)
        let id = new_item._id.toString()
        new_item.id = id
        let extname = path.extname(req.file.originalname)
        let filename = id + extname
        imagekit.upload({
            file: req.file.buffer, //required
            fileName: filename,   //required
        }, async function (error, result) {
            if (error) { console.log(error) }
            else {
                new_item.pic_link = result.url
                new_item.file_id = result.fileId
                await new_item.save()
                res.redirect("/restaurant/menu_snacks")
            }

        });

    } catch (err) {
        next(err)
    }
}

/* POST function for update a item in menu snacks*/
const menu_snacks_change_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        await database.snack.updateOne({ id: item_id }, { $set: req.body })

        res.redirect("/restaurant/menu_snacks")
    } catch (err) {
        next(err)
    }
}

/* POST function for delect a item in menu snacks*/
const menu_snacks_delect_item_POST = async (req, res, next) => {
    try {
        let item_id = req.params.id

        let item = await database.snack.findOne({ id: item_id }).lean()
        let file_id = item.file_id

        imagekit.deleteFile(file_id, function (error, result) {
            if (error) console.log(error);
            else;
        });
        await database.snack.deleteOne({ id: item_id })

        res.redirect("/restaurant/menu_snacks")
    } catch (err) {
        next(err)
    }
}

module.exports = {
    home_page_GET,
    new_order_page_GET,
    new_order_page_accept_POST,
    new_order_page_reject_POST,
    order_processing_page_GET,
    order_processing_page_finished_POST,
    finished_order_page_GET,
    finished_order_page_picked_POST,
    restaurant_password_reset_page_GET,
    restaurant_password_reset_page_POST,
    menu_bubble_tea_GET,
    menu_bubble_tea_add_item_POST,
    menu_bubble_tea_change_item_POST,
    menu_bubble_tea_delect_item_POST,
    menu_fruit_tea_GET,
    menu_fruit_tea_add_item_POST,
    menu_fruit_tea_change_item_POST,
    menu_fruit_tea_delect_item_POST,
    menu_fresh_juice_GET,
    menu_fresh_juice_add_item_POST,
    menu_fresh_juice_change_item_POST,
    menu_fresh_juice_delect_item_POST,
    menu_cakes_GET,
    menu_cakes_add_item_POST,
    menu_cakes_change_item_POST,
    menu_cakes_delect_item_POST,
    menu_snacks_GET,
    menu_snacks_add_item_POST,
    menu_snacks_change_item_POST,
    menu_snacks_delect_item_POST
}