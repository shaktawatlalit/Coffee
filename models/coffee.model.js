const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoffeeSchema = new Schema({
    name: {type: String, required: true},
    coffeeType: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: true}
})

module.exports = mongoose.model('coffee', CoffeeSchema)