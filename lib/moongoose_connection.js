var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const database_url = `mongodb://${config["Mongo"]["databaseHost"]}:${config["Mongo"]["port"]}/${config["Mongo"]["databaseName"]}`

mongoose.connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Successfully connected to the database ${config["Mongo"]["databaseName"]}`);    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
