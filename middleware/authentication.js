const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
            	return res.send({
            		'Status': 'failure',
					"Error" : {
						"Message": "Invalid access token"
					}
				}).status(403) 
            }

            req.user = user;
            next();
        });
    } else {
        res.send({
        	'Status': 'failure',
			"Error" : {
				"Message": "Unauthorized"
			}
		}).status(401)
    }
};

module.exports = {authenticateJWT}