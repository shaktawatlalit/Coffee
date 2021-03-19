var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const database_url = "mongodb://localhost:27017/coffee_data"

mongoose.connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
