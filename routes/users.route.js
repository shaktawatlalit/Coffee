const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../middleware/authentication')

const {test, createUser, login, createOrder, getAllOrder, ratings, recommendCoffee} = require('../controller/users.controller.js')
router.get('/test', test);
router.post('/', createUser)
router.post('/login', login)
router.post('/:id/order', authenticateJWT,createOrder)
router.get('/:id/orders', authenticateJWT, getAllOrder)
router.post('/:id/order/:orderId/rating', authenticateJWT, ratings)
router.get('/:id/recommendation', authenticateJWT, recommendCoffee)



module.exports = router;