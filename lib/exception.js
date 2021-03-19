class Exception {
	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	sendError(error) {
		console.log(error);
		try {
			error = JSON.parse(error)
			this.res.status(error["status"]).send({
				'Status': 'failure',
				"Error" : {
					"Message": error["error"]
				}
			})
		} catch (err) {
			this.res.status(500).send({
				'Status': 'failure',
				"Error" : {
					"Message": "Internal Server Error"
				}
			})
		}
	}
}

module.exports =  Exception;