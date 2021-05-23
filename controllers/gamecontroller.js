const router = require('express').Router();
const Game = require('../db').import('../models/game');
const StatusCodes = require('http-status-codes');

router.get('/all', (req, res) => {
	Game.findAll({ where: { owner_id: req.body.user.id } })
		.then(
			function findSuccess(games) {
				res.status(StatusCodes.OK).json({
					games: games,
					message: "Data fetched."
				});
			},

			function findFail() {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					message: "Data not found"
				});
			}
		);
});

router.get('/:id', (req, res) => {
	Game.findOne({ where: { id: req.params.id, owner_id: req.body.user.id } })
		.then(
			function findSuccess(game) {
				res.status(StatusCodes.OK).json({
					game: game
				});
			},

			function findFail(err) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					message: "Data not found."
				});
			}
		);
});

router.post('/create', (req, res) => {
	Game.create({
		title: req.body.game.title,
		owner_id: req.body.user.id,
		studio: req.body.game.studio,
		esrb_rating: req.body.game.esrb_rating,
		user_rating: req.body.game.user_rating,
		have_played: req.body.game.have_played
	})
		.then(
			function createSuccess(game) {
				res.status(StatusCodes.OK).json({
					game: game,
					message: "Game created."
				});
			},

			function createFail(err) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
			}
		);
});

router.put('/update/:id', (req, res) => {
	Game.update({
		title: req.body.game.title,
		studio: req.body.game.studio,
		esrb_rating: req.body.game.esrb_rating,
		user_rating: req.body.game.user_rating,
		have_played: req.body.game.have_played
	},
		{
			where: {
				id: req.params.id,
				owner_id: req.body.user.id
			}
		})
		.then(
			function updateSuccess(game) {
				res.status(StatusCodes.OK).json({
					game: game,
					message: "Successfully updated."
				});
			},

			function updateFail(err) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					message: err.message
				});
			}

		);
});

router.delete('/remove/:id', (req, res) => {
	Game.destroy({
		where: {
			id: req.params.id,
			owner_id: req.body.user.id
		}
	})
	.then(
		function deleteSuccess(game) {
			res.status(StatusCodes.OK).json({
				game: game,
				message: "Successfully deleted"
			});
		},

		function deleteFail(err) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: err.message
			});
		}
	);
});

module.exports = router;