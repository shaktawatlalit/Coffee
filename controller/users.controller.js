const userModel = require('../models/users.model')
const promoModel = require('../models/promocode.model')
const coffeeModel = require('../models/coffee.model')
const orderModel = require('../models/orders.model')
const {generateJWTtoken} = require("../lib/utilities")
const Exception = require('../lib/exception');
const Response = require('../lib/Response');
const bcrypt = require("bcrypt")
const saltRounds = 10;

const createUser = async (req, res) => {
	try {
		let {username, password} = req.body;
		if (!username || !password) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Please provide username or password.'}))
		}
		const user = await userModel.findOne({username});
		if (user) {
			throw new Error(JSON.stringify({ "status": 409, "error": "User already exists"}))
		}
        password = bcrypt.hashSync(password, saltRounds);
	    const data = await userModel.create({username, password});
	    if (data) {
	    	const token = generateJWTtoken(data._id)
	    	new Response(req, res).sendResponse(201, {
	    		"userId": data._id,
	    		"token": token
	    	})
	    	return;
	    }
	    throw new Error(JSON.stringify({ "status": 503, "error": "Error while creating user"}))
	} catch(err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

const login = async(req, res) => {
	try {
		let {username, password} = req.body;
		if (!username || !password) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Please provide username or password.'}))
		}
		const user = await userModel.findOne({username});
		if (!user) {
			throw new Error(JSON.stringify({ "status": 404, "error": "User Not found"}))
		}
		if (!bcrypt.compareSync(password, user.password)) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Invalid Credentials"}));
		}
		const token = generateJWTtoken(user._id)
		new Response(req, res).sendResponse(200, {
			"userId": user._id,
			"token": token
		})
		return;
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}  
}

const recommendCoffee = async(req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please provide valid user id"}));
		}
		const userData = await userModel.findOne({
			_id: userId
		})
		if (!userData) {
			throw new Error(JSON.stringify({ "status": 404, "error": "User does not found"}))
		}
		
		const query = [
		    {
	    		$match : {
	    			userId : userId
	    		}
	    	}, {
				"$group": {
					"_id": {
						"coffeeId": { "$toObjectId": "$coffeeId" }
					},
					"totalOrder": { "$sum": 1 }
				}
			}, {
					$sort :{
						totalOrder : -1
					} 
			}, { 
					$limit : 5 
			}, { 
				"$lookup": {
					"from": "coffees",
					"localField": "_id.coffeeId",
					"foreignField": "_id",
					"as": "productObjects"
				}
			}, {
				$unwind: "$productObjects"
			}, {
				$project: {
					"_id": "$productObjects._id",
					"name": "$productObjects.name",
					"size": "$productObjects.name",
					"price": "$productObjects.price" ,
					"coffeeType": "$productObjects.coffeeType"						
				}
			}
		]
	
	    const orderedCoffeeItem = await orderModel.aggregate(query)
		if (orderedCoffeeItem.length) {
			new Response(req, res).sendResponse(200, {
				"Recommended Coffee Item": orderedCoffeeItem
			})
			return;
		} else {
			const popularItems = await orderModel.aggregate(query.slice(1,))
			new Response(req, res).sendResponse(200, {
				"Recommended Coffee Item": popularItems
			})
			return;
			
		}
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}

module.exports = {createUser, login, recommendCoffee}