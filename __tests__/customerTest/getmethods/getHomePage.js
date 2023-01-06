const mongoose = require("mongoose")
const customerController = require("../../../controllers/customerController")
const Database = require("../../../models/database_schema")

describe("unit testing get customer homepage", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {cart_amount: 1}
    };
    beforeAll(()=>{
        res.render.mockClear();
        customerController.getHomePage(req, res);
    })
    test("test case1: testing with getting customer home page", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('customerHomePage', {amount: 1})
    })
})