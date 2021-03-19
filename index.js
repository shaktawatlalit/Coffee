const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser")
const cors = require("cors");
let config = require("./config/dev.json");
global.config = config;
const moongoose_connection = require('./lib/moongoose_connection.js')
const users = require('./routes/v1/users.route.js');
const coffee = require('./routes/v1/coffee.route.js');
const promocode = require('./routes/v1/promocode.route.js');
const orders = require('./routes/v1/orders.route.js');

var cluster = require('cluster');

var workers = process.env.WORKERS || 1 || require('os').cpus().length;

if (cluster.isMaster) {

  console.log('start cluster with %s workers', workers);

  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid);
  }

  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });

} else {
	app.use(bodyParser.json())
	app.use(cors())
	app.use('/v1/users/', users);
	app.use('/v1/coffee', coffee);
	app.use('/v1/promocode', promocode);
	app.use('/v1/user/', orders)
	app.listen(config['port'], async ()=> {
		console.log(`application running on port ${config['port']}`);
	})

}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})