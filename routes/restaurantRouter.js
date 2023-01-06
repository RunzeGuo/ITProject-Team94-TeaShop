const express = require('express')
const path = require('path');
const multer = require('multer')
const crypto = require('crypto')
const storage = multer.memoryStorage()
/*
const  storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        randomFileName = crypto.randomBytes(20).toString('hex');
        cb(null, randomFileName + extname)
    }
})

*/

const upload = multer({ storage: storage })

var ImageKit = require("imagekit");

// create our Router object
const restaurantRouter = express.Router()

// import demo controller functions
const restaurantController = require('../controllers/restaurantController')

restaurantRouter.get('/new_order', restaurantController.new_order_page_GET)
restaurantRouter.post('/new_order/accept/:id', restaurantController.new_order_page_accept_POST)
restaurantRouter.post('/new_order/reject/:id', restaurantController.new_order_page_reject_POST)

restaurantRouter.get('/processing_order', restaurantController.order_processing_page_GET)
restaurantRouter.post('/processing_order/finish/:id', restaurantController.order_processing_page_finished_POST)

restaurantRouter.get('/finished_order', restaurantController.finished_order_page_GET)
restaurantRouter.post('/finished_order/pick/:id', restaurantController.finished_order_page_picked_POST)

restaurantRouter.get('/reset_password', restaurantController.restaurant_password_reset_page_GET)
restaurantRouter.post('/reset_password', restaurantController.restaurant_password_reset_page_POST)

restaurantRouter.get('/menu_bubble_tea', restaurantController.menu_bubble_tea_GET)
restaurantRouter.post('/menu_bubble_tea_new_item', upload.single('file'), restaurantController.menu_bubble_tea_add_item_POST)
restaurantRouter.post('/menu_bubble_tea_item/update/:id', restaurantController.menu_bubble_tea_change_item_POST)
restaurantRouter.post('/menu_bubble_tea_item/delect/:id', restaurantController.menu_bubble_tea_delect_item_POST)

restaurantRouter.get('/menu_fruit_tea', restaurantController.menu_fruit_tea_GET)
restaurantRouter.post('/menu_fruit_tea_new_item', upload.single('file'), restaurantController.menu_fruit_tea_add_item_POST)
restaurantRouter.post('/menu_fruit_tea_item/update/:id', restaurantController.menu_fruit_tea_change_item_POST)
restaurantRouter.post('/menu_fruit_tea_item/delect/:id', restaurantController.menu_fruit_tea_delect_item_POST)

restaurantRouter.get('/menu_fresh_juice', restaurantController.menu_fresh_juice_GET)
restaurantRouter.post('/menu_fresh_juice_new_item', upload.single('file'), restaurantController.menu_fresh_juice_add_item_POST)
restaurantRouter.post('/menu_fresh_juice_item/update/:id', restaurantController.menu_fresh_juice_change_item_POST)
restaurantRouter.post('/menu_fresh_juice_item/delect/:id', restaurantController.menu_fresh_juice_delect_item_POST)

restaurantRouter.get('/menu_cakes', restaurantController.menu_cakes_GET)
restaurantRouter.post('/menu_cakes_new_item', upload.single('file'), restaurantController.menu_cakes_add_item_POST)
restaurantRouter.post('/menu_cakes_item/update/:id', restaurantController.menu_cakes_change_item_POST)
restaurantRouter.post('/menu_cakes_item/delect/:id', restaurantController.menu_cakes_delect_item_POST)

restaurantRouter.get('/menu_snacks', restaurantController.menu_snacks_GET)
restaurantRouter.post('/menu_snacks_new_item', upload.single('file'), restaurantController.menu_snacks_add_item_POST)
restaurantRouter.post('/menu_snacks_item/update/:id', restaurantController.menu_snacks_change_item_POST)
restaurantRouter.post('/menu_snacks_item/delect/:id', restaurantController.menu_snacks_delect_item_POST)

// export the router
module.exports = restaurantRouter