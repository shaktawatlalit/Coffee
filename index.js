const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser")
const cors = require("cors");
const axios = require("axios");
const moongoose_connection = require('./moongoose_connection.js')
const users = require('./routes/users.route.js');
const coffee = require('./routes/coffee.route.js');
const promocode = require('./routes/promocode.route.js');

app.use(bodyParser.json())
app.use(cors())
app.use('/v1/users', users);
app.use('/v1/coffee', coffee);
app.use('/v1/promocode', promocode)

const port = 9001;
app.listen(port, async ()=> {
	console.log(`application running on port ${port}`);
})