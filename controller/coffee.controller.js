const Coffee = require('../models/coffee.model')
const test = async (req, res) => {
	res.send({
		'Status': 'success',
		'Data' : {
			'Message': 'Greetings from the Coffee controller!'
		}
	}).status(200);
	return;
}

const createCoffeeItem = async (req, res) => {
	try {
		const {name, coffeeType, price, size} = req.body;
		const invalidArguments = []
		if (!name) {
			invalidArguments.push('name')
		}
		if (!price) {
			invalidArguments.push('price')
		}
		if (!size) {
			invalidArguments.push('size')
		}
		if (invalidArguments.length) {
			throw new Error('Invalid praramters are '+invalidArguments.join(','))
		}
		const validSize = ["small", "medium", "large"].find(itemSize => itemSize == size.toLowerCase())
		if (!validSize) {
			throw new Error('Please specify valid size. Valid sizes are small, medium and large.')
		}
		const coffeeData = await Coffee.findOne({
			'name': name,
			'coffeeType': coffeeType || 'hot',
			'size': validSize
		})
		if (coffeeData) {
			throw new Error('Item already exists.')
		}
		const insertedCoffee = await Coffee.create({
			'name': name,
			'coffeeType': coffeeType || 'hot',
			'size': validSize,
			'price': price
		})
		if (!insertedCoffee) {
			throw new Error('Error while creating coffee item');
		}
		return res.send({
			'Status': 'Success',
    		"Data" : {
    			"Message": "Item created successfully"
    		}
    	}).status(200)
	} catch (err) {
		console.log("error while creating coffee items..", err)
		return res.send({
			'Status': 'failure',
			"Error" : {
				"Message": err
			}
		}).status(400)
	}
} 

const getMenu = async (req, res) => {
	try {
		const coffeeMenu = await Coffee.find({});
		return res.send({
	    		'Status': 'Success',
	    		"Data" : {
	    			'menu': coffeeMenu
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
module.exports = {test, createCoffeeItem, getMenu} 