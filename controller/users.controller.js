const userModel = require('../models/users.model')
const promoModel = require('../models/promocode.model')
const coffeeModel = require('../models/coffee.model')
const orderModel = require('../models/orders.model')
const jwt = require('jsonwebtoken');

const test = (req, res) => {
	res.send({
		'Status': 'Success',
		'Data' : {
			'Message': 'Greetings from the Users controller!'
		}
	}).status(200);
	return;
}

const createUser = async (req, res) => {
	try {
		const {username, password} = req.body;
		if (!username || !password) {
			throw new Error("Please provide valid username or password")
		}
		const user = await userModel.findOne({username});
		if (user) {
			throw new Error("User already exists")
		}
	    const data = await userModel.create({username, password});
	    if (data) {
	    	const token = await generateJWTtoken(data._id, 'youraccesstokensecret')
	    	return res.send({
	    		'Status': 'Success',
	    		"Data" : {
	    			"userId": data._id,
	    			"token": token
	    		}
	    	}).status(200)
	    }
	    throw new Error("Error while creating user")
	} catch(err) {
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const login = async(req, res) => {
	try {
		const {username, password} = req.body;
		if (!username || !password) {
			throw new Error("Please provide valid username or password")
		}
		const user = await userModel.findOne({username, password});
		if (!user) {
			throw new Error("User Not found")
		}
		const token = await generateJWTtoken(user._id, 'youraccesstokensecret')
		return res.send({
			'Status': 'Success',
			"Data" : {
				"userId": user._id,
				"token": token
			}
		}).status(200)
	} catch (err) {
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}

    
}

const createOrder = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error("Please provide valid user id");
		}
		const {coffeeId, quantity, promoCode} = req.body;
		if (!coffeeId) {
			throw new Error("Please provide valid coffee id.")
		}
		if (!quantity || !Number.isInteger(quantity) || quantity < 0) {
			throw new Error("Please provide valid Quantity")
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error("User does not exists.")
		}
		let discountPercent = 0;
		if (promoCode) {
			const promoData = await promoModel.findOne({
				_id: promoCode,
				applicableOnItems: {"$in": [coffeeId]}

			})
			if (!promoCode || !promoCode.active) {
				throw new Error("Invalid promo code")
			}
			discountPercent = promoCode.discount;
		}
		const coffeeProduct = await coffeeModel.findOne({
			_id: coffeeId
		})
		console.log("item...", coffeeProduct)
		if (!coffeeProduct) {
			throw new Error("This coffee product is not available.");
		}
		const totalWithoutDiscout = parseInt(quantity) * coffeeProduct.price;
		const discountPrice = (totalWithoutDiscout * discountPercent)/100;
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
			quantity: quantity
		})
		if (orderData) {
			return res.send({
			'Status': 'Success',
			"Data" : {
				"orderId": orderData._id
			}
		}).status(200)
		}
		throw new Error("Error while creating order.....");
	} catch (err) {
		console.log("error in order creation.........", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const getAllOrder = async(req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error("Please provide valid user id");
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error("User does not exists.")
		}
		const orderList = await orderModel.find({
			userId: userId
		})
		if (orderList) {
			return res.send({
				'Status': 'Success',
				"Data" : {
					"Orders": orderList
				}
			}).status(200)
		}
	} catch (err) {
		console.log("error while getting orders.........", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const recommendCoffee = async(req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error("Please provide valid user id");
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error("User does not exists.")
		}
		const orderedCoffeeItem = await orderModel.find({
			userId: userId
		}, {'coffeeId': 1, 'name': 1, 'coffeeType': 1, 'size': 1}).sort({'createdAt': -1}).limit(3);
		if (orderedCoffeeItem) {
			return res.send({
				'Status': 'Success',
				"Data" : {
					"Recommended Coffee Item": orderedCoffeeItem
				}
			}).status(200)
		}
	} catch (err) {
		console.log("error while recommending coffee items.........", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
}

const ratings = async(req, res) => {
	try {
		const {id, orderId} = req.params;
		console.log("url parameters.....", req.params)
		if (!id || !orderId) {
			throw new Error('Invalid User Id or Order Id')
		}
		const {rating} = req.body;
		if (!rating || !Number.isInteger(rating) || rating < 0) {
			throw new Error('Invalid rating')
		}
		const updateRating = await orderModel.updateOne({
			'userId': id,
			'_id': orderId
		}, {
			'rating': rating
		})
		if (updateRating) {
			return res.send({
				'Status': 'Success',
				"Data" : {
					"Message": 'Rating updated succefully'
				}
			}).status(200)
		}
		throw new Error('Error while updating rating..')
	} catch (err) {
		console.log("error while getting orders.........", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}

}
const generateJWTtoken = async (id, accessTokenSecret) => {
	 const accessToken = jwt.sign({
	 	username: id},
	 	accessTokenSecret, { expiresIn: '20m' }
	 );
	return accessToken;
}

module.exports = {test, createUser, login, createOrder, getAllOrder, ratings, recommendCoffee}