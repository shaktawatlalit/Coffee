const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	userId: {type: String, required: true},
	coffeeId: {type: String, required: true},
	name: {type: String, required: true},
	coffeeType: {type: String, required: true},
	price: {type: String, required: true},
	size: {type: String, required: true},
	rating: {type: Number, default: 0},
	orderTotal: {type: Number, required: true},
	totalDiscount: {type: Number, required: true},
	promoId: {type: String, default: null},
	totalDiscount: {type: Number, default: 0},
	createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('order', OrderSchema)