const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../../middleware/authentication')

const {createUser, login, recommendCoffee} = require('../../controller/users.controller.js')
router.post('/', createUser)
router.post('/login', login)
router.get('/:id/recommendation', authenticateJWT, recommendCoffee)



module.exports = router;