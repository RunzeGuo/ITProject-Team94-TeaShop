const customerController = require("../../../controllers/customerController")
// @ponicode, flash test and unit test
describe("customerController.getResetPassword", () => {
    test("0", async () => {
        await customerController.getResetPassword({ flash: () => "http://placeimg.com/640/480" }, { render: () => true }, true)
    })

    test("1", async () => {
        await customerController.getResetPassword({ flash: () => "http://placeimg.com/640/480" }, { render: () => false }, false)
    })

    test("2", async () => {
        await customerController.getResetPassword({ flash: () => "http://placeimg.com/640/480" }, { render: () => true }, false)
    })

    test("3", async () => {
        await customerController.getResetPassword({ flash: () => "http://placeimg.com/640/480" }, { render: () => false }, true)
    })

    test("4", async () => {
        await customerController.getResetPassword({ flash: () => "" }, { render: () => true }, true)
    })

    test("5", async () => {
        let result = await customerController.getResetPassword({ flash: () => "" }, { render: () => true }, false)
        expect(result).toBe(true)
    })
})