const promoCodeModel = require('../models/promocode.model')

const test = (req, res) => {
	res.send({
		'Status': 'Success',
		'Data' : {
			'Message': 'Greetings from the Users controller!'
		}
	}).status(200);
	return;
}

const createPromoCode = async (req, res) => {
	console.log("in promo controller..........");
	try {
		const {promoName, applicableOn, discount} = req.body;
		if (!promoName) {
			throw new Error('Please provide a valid name to promocode');
		}
		if (!discount || !Number(discount)) {
			throw new Error('Please provide a valid discount');
		}

		const findPromoCode = await promoCodeModel.findOne({
			"promoName": promoName,
			"Active": true
		})
		if (findPromoCode) {
			throw new Error("Promo code already exists.");
		}

		const insertPromoCode = await promoCodeModel.create({
			"promoName": promoName,
			"Active": true,
			"applicableOnItems": applicableOn,
			"discount": discount
		})
		if (insertPromoCode) {
			return res.send({
	    		'Status': 'Success',
	    		"Data" : {
	    			"Message": "Promo code created successfully"
	    		}
	    	}).status(200)
		}
		throw new Error("Error while creating promocode");
	} catch (err) {
		console.log("error..............", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const getAllPromoCode = async (req, res) => {
	try {
		const allPromoCode = await promoCodeModel.find({})
		return res.send({
			'Status': 'Success',
			'Data' : {
				'Promo': allPromoCode
			}
		}).status(200); 
	} catch (err) {
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const updatePromoCode = async (req, res) => {
	try {
		const promoId = req.params.id;
		if (!promoId) {
			throw new Error('Promo pass a valid promo id')
		}
		const {active, applicableOn, discount} = req.body;
		const dataToUpdate = {
		};
		if (active) {
			dataToUpdate['Active']  = active;
		}
		if (applicableOn && applicableOn.length) {
			dataToUpdate['applicableOnItems'] = applicableOn
		}
		if (discount && Number(discount)) {
			dataToUpdate['discount'] = discount
		}

		const updatePromo = await promoCodeModel.updateOne({
			'_id': promoId
		}, dataToUpdate)

		if (updatePromo) {
			return res.send({
	    		'Status': 'Success',
	    		"Data" : {
	    			"Message": "Promo code updated successfully"
	    		}
	    	}).status(200)
		}
		throw new Error("Error while updating promo code..");
	} catch (err) {
		console.log("error while updating promo code..", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}

}
module.exports = {createPromoCode, getAllPromoCode, updatePromoCode}