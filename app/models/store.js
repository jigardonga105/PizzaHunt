const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storename: { type: String, required: true },
    owner: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    zipcode: { type: String, required: true },
    image: [{ img: { type: String } }],
    description: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Store', storeSchema)