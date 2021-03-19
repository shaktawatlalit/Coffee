const express = require('express');
const router = express.Router();

const {createPromoCode, getAllPromoCode, updatePromoCode} = require('../controller/promo.controller.js')
router.post('/', createPromoCode)
router.get('/', getAllPromoCode)
router.put('/:id', updatePromoCode)

module.exports = router;