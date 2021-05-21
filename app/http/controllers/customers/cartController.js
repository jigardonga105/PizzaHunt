const { json } = require("express")

function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for the first time creating cart
            if (!req.session.cart) {
                req.session.cart = {}
            }

            let cart = req.session.cart

            //Check if our current customer's cart is already exists
            if (!cart['custID_' + req.user._id + '_cart']) {
                cart['custID_' + req.user._id + '_cart'] = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            // Check if item does not exist in cart 
            if (!cart['custID_' + req.user._id + '_cart'].items[req.body._id]) {

                cart['custID_' + req.user._id + '_cart'].items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty + 1
                cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice + req.body.price

            } else {

                cart['custID_' + req.user._id + '_cart'].items[req.body._id].qty = cart['custID_' + req.user._id + '_cart'].items[req.body._id].qty + 1
                cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty + 1
                cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice + req.body.price

            }
            return res.json({
                totalQty: req.session.cart['custID_' + req.user._id + '_cart'].totalQty
            })
        }
    }
}

module.exports = cartController