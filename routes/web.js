const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const sellerStoreController = require('../app/http/controllers/seller/storeController')
const prodController = require('../app/http/controllers/seller/prodController')


//Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const seller = require('../app/http/middlewares/seller');

function initRoutes(app) {
    app.get('/', homeController().index)

    //For Custom Registration
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)

    //For Custom Login
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)


    //For Seller Registration
    app.get('/sellerReg', authController().sellerReg)
    app.post('/sellerReg', authController().postSellerRegister)

    //For Seller Login
    app.get('/sellerLog', authController().sellerLog)
    app.post('/sellerLog', authController().postSellerLog)


    //For Logout
    app.post('/logout', authController().logout)

    //For cart
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    //Seller routes
    app.get('/seller/sellerStr', seller, sellerStoreController().index)
    app.post('/add-store', sellerStoreController().addStore)
    app.get('/add-store', sellerStoreController().show)
    app.get('/seller/store/:si', sellerStoreController().showStore)
    app.post('/seller/store/:si', sellerStoreController().addProduct)
    app.get('/seller/storeCust/:si', sellerStoreController().editStore)
    app.post('/seller/updatestore/:storeid', sellerStoreController().updateStore)
    app.post('/store-add-img/:storeid', sellerStoreController().storeAddImg)
    app.post('/deleteImg/:imgid', sellerStoreController().deleteImage)


    app.get('/seller/item/:ii', prodController().showItem)
    app.post('/deleteImg/:imgid', prodController().deleteImage)
    app.post('/item-add-img/:itemid', prodController().itemAddImg)
    app.post('/seller/updateitem/:itemid', prodController().updateItem)

    //Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

    //Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)

}

module.exports = initRoutes