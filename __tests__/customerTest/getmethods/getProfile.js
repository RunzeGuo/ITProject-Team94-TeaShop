const mongoose = require("mongoose")
const customerController = require("../../../controllers/customerController")
const Database = require("../../../models/database_schema")

describe("unit testing get profile homepage", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {cart_amount: 1}
    };
    beforeAll(()=>{
        res.render.mockClear();
        customerController.getProfile(req, res);
    })
    test("test case1: testing with getting customer home page", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('profile')
    })
})