const userModel = require('../models/users.model')
const promoModel = require('../models/promocode.model')
const coffeeModel = require('../models/coffee.model')
const orderModel = require('../models/orders.model')
const Exception = require('../lib/exception');
const Response = require('../lib/Response');

const createOrder = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please provide valid user id"}));
		}
		const {coffeeId, quantity, promoCode} = req.body;
		if (!coffeeId) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please provide valid coffee id"}))
		}
		if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
			throw new Error(JSON.stringify({ "status": 400, "error":"Please provide valid Quantity"}))
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error(JSON.stringify({ "status": 404, "error": "User does not exists"}))
		}
		let discountPercent = 0;
		if (promoCode) {
			const promoData = await promoModel.findOne({
				_id: promoCode,
				applicableOnItems: {"$in": [coffeeId]}

			})
			if (!promoData || promoData.Active == false) {
				throw new Error(JSON.stringify({ "status": 400, "error": "Invalid promo code"}))
			}
			discountPercent = parseFloat(promoData.discount);
		}
		const coffeeProduct = await coffeeModel.findOne({
			_id: coffeeId
		})
		if (!coffeeProduct) {
			throw new Error(JSON.stringify({ "status": 404, "error": "Coffee product is not available"}));
		}
		const totalWithoutDiscout = parseInt(quantity) * parseFloat(coffeeProduct.price);
		const discountPrice = parseFloat((totalWithoutDiscout * discountPercent)/100);
		const total = totalWithoutDiscout - discountPrice;

		const orderData = await orderModel.create({
			userId: userId,
			coffeeId: coffeeProduct._id,
			name: coffeeProduct.name,
			coffeeType: coffeeProduct.coffeeType,
			price: coffeeProduct.price,
			size: coffeeProduct.size,
			rating: 0,
			orderTotal: total,
			promoId:promoCode,
			totalDiscount: discountPrice,
			quantity: parseInt(quantity)
		})
		if (orderData) {
			new Response(req, res).sendResponse(201, {
				"orderId": orderData._id
			})
			return;
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

const getAllOrder = async(req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please provide valid user id"}));
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error(JSON.stringify({ "status": 404, "error": "User does not exists"}))
		}
		const orderList = await orderModel.find({
			userId: userId
		})
		if (orderList) {
			new Response(req, res).sendResponse(200, {
				"Orders": orderList
			})
			return;
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

const ratings = async(req, res) => {
	try {
		const {id, orderId} = req.params;
		if (!id || !orderId) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Invalid User Id or Order Id'}))
		}
		const {rating} = req.body;
		if (!rating || isNaN(rating) || parseInt(rating) < 0 ||  parseInt(rating) > 5) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Invalid rating'}))
		}
		const updateRating = await orderModel.updateOne({
			'userId': id,
			'_id': orderId
		}, {
			'rating': rating
		})
		console.log("update rating....", updateRating)
		if (updateRating && updateRating.ok) {
			new Response(req, res).sendResponse(200, {
				"Message": 'Rating updated succefully'
			})
			return;
		} else {
			throw new Error(JSON.stringify({ "status": 404, "error": 'Order not found for this user'}))
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}

}

module.exports = {createOrder, getAllOrder, ratings}