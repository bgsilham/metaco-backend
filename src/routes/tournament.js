const router = require('express').Router()
const tournamentController = require('../controllers/tournament')

router.get('/', tournamentController.getTournamentResult)
router.get('/team', tournamentController.getTeam)
router.get('/:id', tournamentController.getResultByTournament)
router.post('/', tournamentController.createTournamentResult)
router.patch('/:id', tournamentController.updateTournamentResult)
router.delete('/:id', tournamentController.deleteTournamentResult)

module.exports = router