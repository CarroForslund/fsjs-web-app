const httpRequest = require('request');
const config = require('../config/config');

module.exports = function (req) {

	const options = {
		url: 'https://api.instagram.com/oauth/access_token',
		method: 'POST',
		form: {
			client_id: config.instagram.client_id,
			client_secret: config.instagram.client_secret,
			grant_type: 'authorization_code',
			redirect_uri: config.instagram.redirect_uri,
			code: req.query.code
		}
	};
	httpRequest(options, function (err, res, body) {
		if (!err && res.statusCode == 200) {
      console.log(body);
			// var user = JSON.parse(body);
			// console.log(user);
		} else {
      console.log('error', err);
    }
	});

};
