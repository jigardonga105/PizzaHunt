const Store = require('../../../models/store')

function storeController() {
    return {
        async index(req, res) {
            const store = await Store.exists({ sellerId: req.user._id });
            const storeData = await Store.find({ sellerId: req.user._id });

            if (store) {
                return res.render('seller/sellerStr', { store: true, storeData })
            } else {
                return res.render('seller/sellerStr', { store: false })
            }
        },

        addStore(req, res) {
            const { storename, storeownername, storecontact, storeaddress, country, storezip, storedesc } = req.body

            //Store files names in Array-------------------------------------------------
            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            //=============================================================================

            const result = new Store({
                sellerId: req.user.id,
                storename,
                owner: storeownername,
                phone: storecontact,
                address: storeaddress,
                country,
                zipcode: storezip,
                image: productPictures,
                description: storedesc
            })

            result.save()
                .then((result) => {
                    return res.redirect('/seller/sellerStr')
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/add-store')
                })
                // return res.redirect('seller/sellerStr')
        },

        show(req, res) {
            return res.render('seller/sellerStr', { store })
        }
    }
}

module.exports = storeController;