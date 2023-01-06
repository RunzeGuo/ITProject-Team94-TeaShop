const mongoose = require("mongoose")
const customerController = require("../../../controllers/customerController")
const Database = require("../../../models/database_schema")

describe("unit testing get all bubble tea", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {cart_amount: 1}
    };
    beforeAll(()=>{
        res.render.mockClear();
        Database.bubbleTea.find = jest.fn().mockResolvedValue([
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
              },
              {
                _id: "63270d3519f34ac69b80efe2",
                name: "Matcha",
                pic_link: "Stirng",
                prices: 8.5,
                is_on_sale: true,
                discount: 0.8,
                toppings: {},
                __v: 0
              }
        ])
        Database.bubbleTea.find.mockImplementationOnce(()=>({
            lean: jest.fn().mockReturnValue([
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
                  },
                  {
                    _id: "63270d3519f34ac69b80efe2",
                    name: "Matcha",
                    pic_link: "Stirng",
                    prices: 8.5,
                    is_on_sale: true,
                    discount: 0.8,
                    toppings: {}
                  }
                ])
        }))
        customerController.getAllBubbleTea(req, res);
    })
    test("test case: testing with getting all bubble tea", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('menu', {data: [
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
              },
              {
                _id: "63270d3519f34ac69b80efe2",
                name: "Matcha",
                pic_link: "Stirng",
                prices: 8.5,
                is_on_sale: true,
                discount: 0.8,
                toppings: {}
              }
            ], amount: 1})
    })
})