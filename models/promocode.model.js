const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema({
	promoName: {type: String, required: true},
	applicableOnItems: {type: Array, default: []},
	discount: {type: Number, required: true},
	Active: {type: Boolean, default: true},
	createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('promoCode', PromoCodeSchema)