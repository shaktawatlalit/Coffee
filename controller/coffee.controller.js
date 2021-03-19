const Coffee = require('../models/coffee.model')
const Exception = require('../lib/exception');
const Response = require('../lib/Response');

const createCoffeeItem = async (req, res) => {
	try {
		const {name, coffeeType, price, size} = req.body;
		const invalidArguments = []
		if (!name) {
			invalidArguments.push('name')
		}
		if (!price || isNaN(price) || parseInt(price) < 0) {
			invalidArguments.push('price')
		}
		if (!size) {
			invalidArguments.push('size')
		}
		if (invalidArguments.length) {
			throw new Error(JSON.stringify({ "status": 400, "error": 'Invalid praramters are '+invalidArguments.join(',')}))
		}
		const validSize = ["small", "medium", "large"].find(itemSize => itemSize == size.toLowerCase())
		if (!validSize) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Please specify valid size. Valid sizes are small, medium and large"}))
		}
		const coffeeData = await Coffee.findOne({
			'name': name,
			'coffeeType': coffeeType || 'hot',
			'size': validSize
		})
		if (coffeeData) {
			throw new Error(JSON.stringify({ "status": 409, "error": "Item already exists."}))
		}
		const insertedCoffee = await Coffee.create({
			'name': name,
			'coffeeType': coffeeType || 'hot',
			'size': validSize,
			'price': parseFloat(price)
		})
		if (!insertedCoffee) {
			throw new Error(JSON.stringify({ "status": 400, "error": "Error while creating coffee item"}));
		}
    	new Response(req, res).sendResponse(201, {
			"Message": "Item created successfully"
		})
		return;
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
} 

const getMenu = async (req, res) => {
	try {
		const coffeeMenu = await Coffee.find({});
		new Response(req, res).sendResponse(200, {
			'menu': coffeeMenu
		})
		return;
	} catch (err) {
		new Exception(req, res).sendError(err.message)
		return;
	}
}
module.exports = {createCoffeeItem, getMenu} 