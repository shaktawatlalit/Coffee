class Response {
	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	sendResponse(status, data) {
		this.res.status(status).send({
			'Status': 'Success',
			"Data" : data
		})
	}
}

module.exports =  Response;