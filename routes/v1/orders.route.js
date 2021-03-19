const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../../middleware/authentication')

const {createOrder, getAllOrder, ratings} = require('../../controller/orders.controller.js')
router.post('/:id/order', authenticateJWT,createOrder)
router.get('/:id/order', authenticateJWT, getAllOrder)
router.post('/:id/order/:orderId/rating', authenticateJWT, ratings)


module.exports = router;