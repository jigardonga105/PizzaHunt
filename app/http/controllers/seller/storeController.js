const Store = require('../../../models/store')
const Menu = require('../../../models/menu')
const fs = require('fs');

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
        },

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
        },

        async editStore(req, res) {
            const store = await Store.find({ _id: req.params.si })
            let imageSet = await Store.find().select({ image: 1, _id: 0 })

            if (store) {
                res.render('seller/storeCust', { store, imageSet })
            }
        },

        async updateStore(req, res) {
            if (req.body.changedname) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { storename: req.body.changedname } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedowner) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { owner: req.body.changedowner } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedcontact) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { phone: req.body.changedcontact } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedaddress) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { address: req.body.changedaddress } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedcountry) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { country: req.body.changedcountry } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedzip) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { zipcode: req.body.changedzip } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changeddesc) {
                const name = await Store.updateOne({ _id: req.params.storeid }, { $set: { description: req.body.changeddesc } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeid}`)
                } else {
                    res.render('/')
                }
            }

        },

        async storeAddImg(req, res) {
            const store = await Store.find({ _id: req.params.storeid })
            let imageSet = await Store.find().select({ image: 1, _id: 0 })

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const result = await Store.updateOne({ _id: req.params.storeid }, { $push: { image: { $each: productPictures } } })
                // console.log(result);
            if (result) {
                res.redirect(`/seller/storeCust/${req.params.storeid}`)
            } else {
                res.render('/')
            }
        },

        async deleteImage(req, res) {
            let imageSet = await Store.find().select({ image: 1, _id: 0 })

            if (imageSet) {

                for (let j = 0; j < imageSet.length; j++) {

                    for (let k = 0; k < imageSet[j].image.length; k++) {

                        if (imageSet[j].image[k]._id == req.params.imgid) {

                            let result = true;

                            if (result) {

                                const del = await Store.updateOne({}, { $pull: { image: { _id: req.params.imgid } } }, { multi: true })
                                if (del) {
                                    fs.unlink(`public/uploadedImages/${imageSet[j].image[k].img}`, (err, res) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                }
                            }

                        } else {

                            result = false;
                        }
                    }
                }
            }


        },
    }
}

module.exports = storeController;