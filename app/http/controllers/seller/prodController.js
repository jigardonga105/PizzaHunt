const Menu = require('../../../models/menu')
const Store = require('../../../models/store')


function prodController() {
    return {
        async showStore(req, res) {
            const store = await Store.exists({ sellerId: req.user._id });
            const storeData = await Store.find({ _id: req.params.si });
            const menu = await Menu.find({ storeId: req.params.si })

            if (store) {
                return res.render('seller/store', { store: true, storeData, menu })
            } else {
                return res.render('seller/store', { store: false })
            }
        },

        addProduct(req, res) {

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const result = new Menu({
                storeId: req.params.si,
                name: req.body.productname,
                size: req.body.size,
                price: req.body.price,
                desc: req.body.productdesc,
                image: productPictures
            })

            result.save()
                .then((result) => {
                    return res.redirect(`/seller/store/${req.params.si}`)
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'Something went wrong')
                    return res.redirect(`/seller/store/${req.params.si}`)
                })
        }
    }
}

module.exports = prodController;