const Menu = require('../../../models/menu')

function rateController() {
    return {
        async index(req, res) {
            // console.log(req.body.pdID);
            // console.log(req.body.rate);
            const product = await Menu.find({ _id: req.body.pdID })

            //=========================================================================================================
            // when first user of web site come for product rating then this happens

            if (!req.session.rate) {
                req.session.rate = {}
            }
            let rate = req.session.rate
            if (!rate['custID_' + req.user._id + '_rate']) {
                rate['custID_' + req.user._id + '_rate'] = {
                    products: {}
                }
            }

            if (!req.session.vote) {
                req.session.vote = {}
            }
            let vote = req.session.vote

            if (!req.session.ProductsRate) {
                req.session.ProductsRate = {}
            }
            let ProductsRate = req.session.ProductsRate

            //=================================================
            //=================================================
            //=================================================
            //==================================================

            if (!rate['custID_' + req.user._id + '_rate'].products[req.body.pdID]) {

                rate['custID_' + req.user._id + '_rate'].products[req.body.pdID] = {
                    item: product[0]._id,
                    rate: req.body.rate
                }

                if (!vote[req.body.pdID]) {

                    vote[req.body.pdID] = {
                        _id: req.body.pdID,
                        vote: product[0].vote + 1
                    }
                } else {
                    vote[req.body.pdID] = {
                        _id: req.body.pdID,
                        vote: product[0].vote + 1
                    }
                }

                //this is for sum of product rates which is same as rated product
                let rateArray = []
                for (var key in rate) {
                    if (rate.hasOwnProperty(key)) {
                        for (var key2 in rate[key].products) {
                            if (key2 === req.body.pdID) {
                                rateArray.push(parseInt(rate[key].products[key2].rate));
                            }
                        }
                    }
                }
                // console.log(rateArray);

                //this is for sum of rateArray values
                let reducer = (accumulator, currentValue) => accumulator + currentValue;
                let prodRateSum = rateArray.reduce(reducer)

                //this is for sum of product votes which is same as rated product
                let prodVoteSum
                for (let key in vote) {
                    if (key === req.body.pdID) {
                        prodVoteSum = vote[key].vote
                    }
                }

                let prodRate = prodRateSum / prodVoteSum

                if (!ProductsRate[req.body.pdID]) {
                    ProductsRate[req.body.pdID] = {
                        _id: req.body.pdID,
                        rating: prodRate
                    }
                }

                const result1 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { vote: vote[req.body.pdID].vote } })
                const result2 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { rating: prodRate } })

                if (result1 && result2) {
                    const pizzas = await Menu.find()
                    return res.redirect('/');
                }

            } else {

                rate['custID_' + req.user._id + '_rate'].products[req.body.pdID] = {
                    item: product[0],
                    rate: req.body.rate
                }

                //this is for sum of product rates which is same as rated product
                let rateArray = []
                for (var key in rate) {
                    if (rate.hasOwnProperty(key)) {
                        for (var key2 in rate[key].products) {
                            if (key2 === req.body.pdID) {
                                rateArray.push(parseInt(rate[key].products[key2].rate));
                            }
                        }
                    }
                }
                // console.log(rateArray);

                //this is for sum of rateArray values
                let reducer = (accumulator, currentValue) => accumulator + currentValue;
                let prodRateSum = rateArray.reduce(reducer)

                //this is for sum of product votes which is same as rated product
                let prodVoteSum
                for (let key in vote) {
                    if (key === req.body.pdID) {
                        prodVoteSum = vote[key].vote
                    }
                }

                let prodRate = prodRateSum / prodVoteSum

                if (!ProductsRate[req.body.pdID]) {
                    ProductsRate[req.body.pdID] = {
                        _id: req.body.pdID,
                        rating: prodRate
                    }
                }

                const result1 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { vote: vote[req.body.pdID].vote } })
                const result2 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { rating: prodRate } })

                if (result1 && result2) {
                    const pizzas = await Menu.find()
                    return res.redirect('/');
                }
            }
        }
    }
}

module.exports = rateController