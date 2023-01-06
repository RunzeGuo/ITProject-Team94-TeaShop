const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const user_schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    nickname: String,
    prefer_use_nickname: { type: Boolean, default: true },
    mobile: String,
    username: String,
    role: { type: String, default: "customer"},
    password: String,
    cart: Array,
    cart_prices: {type: Number, default: 0},
    cart_amount: {type: Number, default: 0}
})

user_schema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10

user_schema.pre('save', function save(next) {
    const user = this
    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }

        user.password = hash
        next()
    })
})

const user = mongoose.model('user', user_schema, 'user')

const fruitTea_schema = new Schema({
    id: String,
    name: String,
    pic_link: String,
    file_id: String,
    prices: Number,
    is_on_sale: Boolean,
    discount: Number,
    is_available: Boolean,
    toppings: Object,

})

const fruitTea = mongoose.model('fruitTea', fruitTea_schema, 'fruitTea')

const bubbleTea_schema = new Schema({
    id: String,
    name: String,
    pic_link: String,
    file_id: String,
    prices: Number,
    is_on_sale: Boolean,
    discount: Number,
    is_available: Boolean,
    toppings: Object,
})

const bubbleTea = mongoose.model('bubbleTea', bubbleTea_schema, 'bubbleTea')

const freshJuice_schema = new Schema({
    id: String,
    name: String,
    pic_link: String,
    file_id: String,
    prices: Number,
    is_on_sale: Boolean,
    discount: Number,
    is_available: Boolean,
    toppings: Object,
})

const freshJuice = mongoose.model('freshJuice', freshJuice_schema, 'freshjuice')

const cake_schema = new Schema({
    id: String,
    name: String,
    pic_link: String,
    file_id: String,
    prices: Number,
    is_on_sale: Boolean,
    discount: Number,
    is_available: Boolean,
})

const cake = mongoose.model('cake', cake_schema, 'cake')

const snack_schema = new Schema({
    id: String,
    name: String,
    pic_link: String,
    file_id: String,
    prices: Number,
    is_on_sale: Boolean,
    discount: Number,
    is_available: Boolean,
})

const snack = mongoose.model('snack', snack_schema, 'snack')

const toppings_schema = new Schema({
    name_and_price: Array,
})

const toppings = mongoose.model('toppings', toppings_schema, 'toppings')

const cart_schema = new Schema({
    name: {type:String, default:"Caramel"},
    pic_link: String,
    prices: {type: Number, default: 9},
    Ice: String,
    Sugar: String,
    amount:{type: Number, default: 1}
})

const cart = mongoose.model('cart', cart_schema, 'cart')

const order_schema = new Schema({
    id: String,
    order_number: {type: String, default: '11645'},
    customer_name: String,
    customer_mobile: String,
    customer_email: String,
    items_and_number: Array,
    total_price: Number,
    time_order_placed: { type: Date, default: Date.now },
    time_order_placed_string: String,
    is_accepted: { type: Boolean, default: false },
    is_rejected: { type: Boolean, default: false },
    time_order_accepted_or_rejected: { type: Date, default: Date.now },
    time_order_accepted_or_rejected_string: String,
    is_finished: { type: Boolean, default: false },
    time_order_finished: { type: Date, default: Date.now },
    time_order_finished_string: String,
    is_picked: { type: Boolean, default: false },
    time_order_picked: { type: Date, default: Date.now },
    time_order_picked_string: String,
})

const order = mongoose.model('order', order_schema, 'order')

const order_detail_schema = new Schema({
    id: String,
    item_name: String,
    toppings: String,
    item_number: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
})

const order_detail = mongoose.model('order_detail', order_detail_schema, 'order_detail')

module.exports = {
    user,
    toppings,
    order,
    bubbleTea,
    freshJuice,
    fruitTea,
    cake,
    snack,
    cart

}