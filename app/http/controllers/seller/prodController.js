const Menu = require('../../../models/menu')
const Store = require('../../../models/store')
const fs = require('fs');


function prodController() {
    return {
        async showItem(req, res) {
            const menu = await Menu.find({ _id: req.params.ii })
            let imageSet = await Menu.find().select({ image: 1, _id: 0 })

            if (menu) {
                res.render('seller/item', { menu, imageSet })
            }
        },

        async deleteItemImage(req, res) {
            let imageSet = await Menu.find().select({ image: 1, _id: 0 })

            if (imageSet) {

                for (let j = 0; j < imageSet.length; j++) {

                    for (let k = 0; k < imageSet[j].image.length; k++) {

                        if (imageSet[j].image[k]._id == req.params.imgid) {

                            let result = true;

                            if (result) {

                                const del = await Menu.updateOne({}, { $pull: { image: { _id: req.params.imgid } } }, { multi: true })
                                if (del) {
                                    fs.unlink(`public/uploadedImages/${imageSet[j].image[k].img}`, (err, res) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (res) {
                                            console.log(res);
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

        async itemAddImg(req, res) {
            const menu = await Menu.find({ _id: req.params.ii })
            let imageSet = await Menu.find().select({ image: 1, _id: 0 })

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const result = await Menu.updateOne({ _id: req.params.itemid }, { $push: { image: { $each: productPictures } } })
                // console.log(result);
            if (result) {
                res.redirect(`/seller/item/${req.params.itemid}`)
            } else {
                res.render('/')
            }
        },

        async updateItem(req, res) {
            if (req.body.changedname) {
                const name = await Menu.updateOne({ _id: req.params.itemid }, { $set: { name: req.body.changedname } })
                if (name) {
                    res.redirect(`/seller/item/${req.params.itemid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedprice) {
                const price = await Menu.updateOne({ _id: req.params.itemid }, { $set: { price: req.body.changedprice } })
                if (price) {
                    res.redirect(`/seller/item/${req.params.itemid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.stock) {
                let stockState
                if (req.body.stock === 'in') {
                    stockState = true;
                } else {
                    stockState = false;
                }
                const stock = await Menu.updateOne({ _id: req.params.itemid }, { $set: { stock: stockState } })
                if (stock) {
                    res.redirect(`/seller/item/${req.params.itemid}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.size) {
                const size = await Menu.updateOne({ _id: req.params.itemid }, { $set: { size: req.body.size } })
                if (size) {
                    res.redirect(`/seller/item/${req.params.itemid}`)
                } else {
                    res.render('/')
                }
            }
        }
    }
}

module.exports = prodController;