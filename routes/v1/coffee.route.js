const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../../middleware/authentication')

const {createCoffeeItem, getMenu} = require('../../controller/coffee.controller.js')
router.post('/', createCoffeeItem)
router.get('/', authenticateJWT, getMenu)


module.exports = router;