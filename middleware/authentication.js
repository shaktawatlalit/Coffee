const jwt = require('jsonwebtoken');
const accessTokenSecret = config["JWT"]["SecretKey"];
const Exception = require('../lib/exception');
const Response = require('../lib/Response');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {

                new Exception(req, res).sendError(JSON.stringify({"status": 403, "error": "Forbidden"}))
            	return;
            }
            req.user = user;
            next();
        });
    } else {
        new Exception(req, res).sendError(JSON.stringify({"status": 401, "error": "Unauthorized"}))
    }
};

module.exports = {authenticateJWT}