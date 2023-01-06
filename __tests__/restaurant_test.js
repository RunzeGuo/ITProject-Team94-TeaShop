const mongoose = require('mongoose')
const Database = require('../models/database_schema')
const restaurantController = require("../controllers/restaurantController")

/*
describe("Tests for restaurant side", () => {
    const req = {
        teaMakerAuthenticated: jest.fn().mockReturnValue("True"),
        teamakerRole: jest.fn().mockReturnValue("True")
    };

    const res = {
        render: jest.fn()
    };

    beforeAll(() => {
        res.render.mockClear();

        Database.order.find = jest.fn().mockResolvedValue([{
            "_id": {
                "$oid": "632fec1d83d42fbcabd3273d"
            },
            "order_number": "1164540",
            "items_and_number": [
                {
                    "name": "Caramel",
                    "prices": 8,
                    "amount": 1,
                    "Ice": "30%",
                    "Sugar": "70%"
                }
            ],
            "is_accepted": false,
            "is_rejected": false,
            "is_finished": false,
            "is_picked": false,
            "time_order_placed": {
                "$date": {
                    "$numberLong": "1664085021776"
                }
            },
            "time_order_accepted_or_rejected": {
                "$date": {
                    "$numberLong": "1664085021776"
                }
            },
            "time_order_finished": {
                "$date": {
                    "$numberLong": "1664085021776"
                }
            },
            "time_order_picked": {
                "$date": {
                    "$numberLong": "1664085021776"
                }
            },
            "total_price": 8,
            "customer_email": "hjc@outlook.com",
            "customer_mobile": "0431665784",
            "customer_name": "HongcheBiden",
            "id": "632fec1d83d42fbcabd3273d",
            "time_order_placed_string": "Sun Sep 25 2022 15:50",
            "__v": 0
        }])

        Database.order.find.mockImplementation(() => ({
            lean: jest.fn().mockReturnValue({
                "_id": {
                    "$oid": "632fec1d83d42fbcabd3273d"
                },
                "order_number": "1164540",
                "items_and_number": [
                    {
                        "name": "Caramel",
                        "prices": 8,
                        "amount": 1,
                        "Ice": "30%",
                        "Sugar": "70%"
                    }
                ],
                "is_accepted": false,
                "is_rejected": false,
                "is_finished": false,
                "is_picked": false,
                "time_order_placed": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_accepted_or_rejected": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_finished": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_picked": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "total_price": 8,
                "customer_email": "hjc@outlook.com",
                "customer_mobile": "0431665784",
                "customer_name": "HongcheBiden",
                "id": "632fec1d83d42fbcabd3273d",
                "time_order_placed_string": "Sun Sep 25 2022 15:50",
                "__v": 0
            }),
            sort: jest.fn().mockReturnValue({
                "_id": {
                    "$oid": "632fec1d83d42fbcabd3273d"
                },
                "order_number": "1164540",
                "items_and_number": [
                    {
                        "name": "Caramel",
                        "prices": 8,
                        "amount": 1,
                        "Ice": "30%",
                        "Sugar": "70%"
                    }
                ],
                "is_accepted": false,
                "is_rejected": false,
                "is_finished": false,
                "is_picked": false,
                "time_order_placed": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_accepted_or_rejected": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_finished": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "time_order_picked": {
                    "$date": {
                        "$numberLong": "1664085021776"
                    }
                },
                "total_price": 8,
                "customer_email": "hjc@outlook.com",
                "customer_mobile": "0431665784",
                "customer_name": "HongcheBiden",
                "id": "632fec1d83d42fbcabd3273d",
                "time_order_placed_string": "Sun Sep 25 2022 15:50",
                "__v": 0
            })

        }))



        restaurantController.new_order_page_GET(req, res);

    })

    test("test new_order_page_GET", () => {
        expect(res.render).toHaveBeenCalledTimes(1);
    })




})
*/