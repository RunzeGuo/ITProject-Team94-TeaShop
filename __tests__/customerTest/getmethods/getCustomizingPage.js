const mongoose = require("mongoose")
const customerController = require("../../../controllers/customerController")
const Database = require("../../../models/database_schema")

//the customizing page for different item are using the same code with different data
//so we just test one of them
describe("unit testing get caramel customizing page", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {cart_amount: 1}
    };
    beforeAll(()=>{
        res.render.mockClear();
        Database.bubbleTea.findOne = jest.fn().mockResolvedValue([
            {
                _id: "63241f20ff56fcf0e964eadc",
                name: "Caramel",
                pic_link: "string",
                prices: 8,
                is_on_sale: true,
                discount: 0.8,
                is_available: true,
                toppings: {},
                display: false,
                __v: 0
              }
        ])
        Database.bubbleTea.findOne.mockImplementationOnce(()=>({
            lean: jest.fn().mockReturnValue(
                {
                    _id: "63241f20ff56fcf0e964eadc",
                    name: "Caramel",
                    pic_link: "string",
                    prices: 8,
                    is_on_sale: true,
                    discount: 0.8,
                    is_available: true,
                    toppings: {},
                    display: false
                  }
                )
        }))
        customerController.getCaramelCustomized(req, res);
    })
    test("test case: testing with getting caramel customize page", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('customize', {name: "Caramel", prices: 8})
    })
})