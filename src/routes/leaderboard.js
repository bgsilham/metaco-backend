const router = require('express').Router()
const leaderboardController = require('../controllers/leaderboard')

router.get('/team', leaderboardController.getLeaderboardTeam)
router.get('/user', leaderboardController.getLeaderboardUser)

module.exports = router