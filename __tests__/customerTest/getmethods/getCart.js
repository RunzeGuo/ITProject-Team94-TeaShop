const mongoose = require("mongoose")
const customerController = require("../../../controllers/customerController")
const Database = require("../../../models/database_schema")

describe("unit testing get cart page", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {username: 'hjc@outlook.com'}
    };
    beforeAll(()=>{
        res.render.mockClear();
        Database.user.findOne = jest.fn().mockResolvedValue([
            {
                "_id": {
                  "$oid": "632848d97e520dc733b11d8e"
                },
                "first_name": "Hongche",
                "last_name": "Biden",
                "nickname": "HCJ",
                "prefer_use_nickname": true,
                "mobile": "0431665784",
                "username": "hjc@outlook.com",
                "role": "customer",
                "password": "$2a$10$Z5LqB4xxUhcjMtioYY0mHeo4v62JOOSn9OBUx2QCfkC8D.r9Ax1VO",
                "__v": 44,
                "cart": [
                  {
                    "name": "Caramel",
                    "prices": 8,
                    "amount": 1,
                    "Ice": "30%",
                    "Sugar": "50%"
                  },
                  {
                    "name": "Classic",
                    "prices": 7,
                    "amount": 1,
                    "Ice": "30%",
                    "Sugar": "50%"
                  }
                ],
                "cart_prices": 15,
                "cart_amount": 2
              }
        ])
        Database.user.findOne.mockImplementationOnce(()=>({
            lean: jest.fn().mockReturnValue(
                {
                    "_id": {
                      "$oid": "632848d97e520dc733b11d8e"
                    },
                    "first_name": "Hongche",
                    "last_name": "Biden",
                    "nickname": "HCJ",
                    "prefer_use_nickname": true,
                    "mobile": "0431665784",
                    "username": "hjc@outlook.com",
                    "role": "customer",
                    "password": "$2a$10$Z5LqB4xxUhcjMtioYY0mHeo4v62JOOSn9OBUx2QCfkC8D.r9Ax1VO",
                    "cart": [
                      {
                        "name": "Caramel",
                        "prices": 8,
                        "amount": 1,
                        "Ice": "30%",
                        "Sugar": "50%"
                      },
                      {
                        "name": "Classic",
                        "prices": 7,
                        "amount": 1,
                        "Ice": "30%",
                        "Sugar": "50%"
                      }
                    ],
                    "cart_prices": 15,
                    "cart_amount": 2
                  }
                )
        }))
        customerController.getCart(req, res);
    })
    test("test case1: testing with getting normal cart page", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('cart', {data: [
            {
              "name": "Caramel",
              "prices": 8,
              "amount": 1,
              "Ice": "30%",
              "Sugar": "50%"
            },
            {
              "name": "Classic",
              "prices": 7,
              "amount": 1,
              "Ice": "30%",
              "Sugar": "50%"
            }
          ], total: 15, totalamount: 2})
    })
})

describe("unit testing get emptycart page", ()=>{
    const res = {
        render: jest.fn()
    };
    const req ={
        user: {username: 'hjc@outlook.com'}
    };
    beforeAll(()=>{
        res.render.mockClear();
        Database.user.findOne = jest.fn().mockResolvedValue([
            {
                "_id": {
                  "$oid": "632848d97e520dc733b11d8e"
                },
                "first_name": "Hongche",
                "last_name": "Biden",
                "nickname": "HCJ",
                "prefer_use_nickname": true,
                "mobile": "0431665784",
                "username": "hjc@outlook.com",
                "role": "customer",
                "password": "$2a$10$Z5LqB4xxUhcjMtioYY0mHeo4v62JOOSn9OBUx2QCfkC8D.r9Ax1VO",
                "__v": 44,
                "cart": [
                  ""
                ],
                "cart_prices": 0,
                "cart_amount": 0
              }
        ])
        Database.user.findOne.mockImplementationOnce(()=>({
            lean: jest.fn().mockReturnValue(
                {
                    "_id": {
                      "$oid": "632848d97e520dc733b11d8e"
                    },
                    "first_name": "Hongche",
                    "last_name": "Biden",
                    "nickname": "HCJ",
                    "prefer_use_nickname": true,
                    "mobile": "0431665784",
                    "username": "hjc@outlook.com",
                    "role": "customer",
                    "password": "$2a$10$Z5LqB4xxUhcjMtioYY0mHeo4v62JOOSn9OBUx2QCfkC8D.r9Ax1VO",
                    
                    "cart": [
                      ""
                    ],
                    "cart_prices": 0,
                    "cart_amount": 0
                  }
                )
        }))
        customerController.getCart(req, res);
    })
    test("test case2: testing with getting empty cart page", ()=>{
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('emptycart')
    })
})