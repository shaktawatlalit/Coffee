const promoCodeModel = require('../models/promocode.model')
const Exception = require('../lib/exception');
const Response = require('../lib/Response');

const createPromoCode = async (req, res) => {
	try {
		const {promoName, applicableOn, discount} = req.body;
		if (!promoName) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please provide a valid name to promocode"}));
		}
		if (!discount || isNaN(discount) || parseInt(discount) < 0) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Please provide a valid discount'}));
		}

		const findPromoCode = await promoCodeModel.findOne({
			"promoName": promoName,
			"Active": true
		})
		if (findPromoCode) {
			throw new Error(JSON.stringify({ "status": 409, "error": "Promo code already exists"}));
		}

		const insertPromoCode = await promoCodeModel.create({
			"promoName": promoName,
			"Active": true,
			"applicableOnItems": applicableOn,
			"discount": parseFloat(discount)
		})
		if (insertPromoCode) {
			new Response(req, res).sendResponse(201, {
				"Message": "Promo code created successfully"
			})
			return;
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

const getAllPromoCode = async (req, res) => {
	try {
		const allPromoCode = await promoCodeModel.find({})
		new Response(req, res).sendResponse(200, {
			'Promo': allPromoCode
		})
		return; 
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

const updatePromoCode = async (req, res) => {
	try {
		const promoId = req.params.id;
		if (!promoId) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Invalid promo id"}))
		}

		const {active, discount, applicableOnItems} = req.body;
		if (!discount || isNaN(discount) || parseInt(discount) < 0) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Please provide a valid discount'}));
		}
		const dataToUpdate = {
		};
		dataToUpdate['Active']  = active && active == true ? true : false;
		if (applicableOnItems && applicableOnItems.length) {
			dataToUpdate['applicableOnItems'] = applicableOnItems
		}
		if (discount && !isNaN(discount) && parseInt(discount) >= 0) {
			dataToUpdate['discount'] = parseFloat(discount)
		}

		const updatePromo = await promoCodeModel.updateOne({
			'_id': promoId
		}, dataToUpdate)
		if (updatePromo && updatePromo.nModified == 1) {
			new Response(req, res).sendResponse(200, {
				"Message": "Promo code updated successfully"
			})
			return;
		} else {
			throw new Error(JSON.stringify({ "status": 404, "error": "Promo code does not exist."}))
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}

}
module.exports = {createPromoCode, getAllPromoCode, updatePromoCode}