const jwt = require('jsonwebtoken');
const generateJWTtoken = (id) => {
	 const accessToken = jwt.sign({
	 	username: id},
	 	config["JWT"]["SecretKey"], { expiresIn: config["JWT"]["Expire"]}
	 );
	return accessToken;
}

module.exports = {generateJWTtoken}