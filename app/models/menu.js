const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    image: [{ img: { type: String } }],
})

module.exports = mongoose.model('Menu', menuSchema)