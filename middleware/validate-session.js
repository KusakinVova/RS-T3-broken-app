const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const StatusCodes = require('http-status-codes');

module.exports = function (req, res, next) {
	if (req.method == 'OPTIONS') {
		next();   // allowing options as a method for request
	} else {
		const sessionToken = req.headers.authorization;
		console.log(sessionToken);
		if (!sessionToken) return res.status(403).send({ auth: false, message: "No token provided." });
		else {
			jwt.verify(sessionToken, 'lets_play_sum_games_man', (err, decoded) => {
				if (decoded) {
					User.findOne({ where: { id: decoded.id } }).then(user => {
						req.user = user;
						console.log(`user: ${user}`);
						next();
					},
						function () {
							res.status(StatusCodes.UNAUTHORIZED).send({ error: "not authorized" });
						})

				} else {
					res.status(StatusCodes.BAD_REQUEST).send({ error: "not authorized" });
				}
			});
		}
	}
}