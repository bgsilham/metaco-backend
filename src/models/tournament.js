const db = require('../utils/db')

module.exports = {
  createTournamentResult: (data) => {
    const sql = 'INSERT INTO tournament_results (team_id, position, point, tournament_id, created_at) VALUES (?,?,?,?,?)'
    const params = [data.team_id, data.position, data.point, data.tournament_id, data.created_at]
    return new Promise((resolve, reject) => {
      db.run(sql, params, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(data)
      })
    })
  },
  getTournamentResult: () => {
    const sql = `SELECT * FROM tournament_results`
    const params = []
    return new Promise((resolve, reject) => {
      db.all(sql, params, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getTeam: () => {
    const sql = `SELECT * FROM teams`
    const params = []
    return new Promise((resolve, reject) => {
      db.all(sql, params, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getTournamentById: (param) => {
    const sql = `SELECT * FROM tournament_results WHERE id = ?`
    return new Promise((resolve, reject) => {
      db.all(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getResultByTournament: (param) => {
    const sql = `SELECT * FROM tournament_results WHERE tournament_id = ? AND position = ? ORDER BY position`
    return new Promise((resolve, reject) => {
      db.all(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateTournamentResult: (param) => {
    const sql = 'UPDATE tournament_results SET team_id = ?, position = ?, point = ?, tournament_id = ?, updated_at = ? WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.run(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(param)
      })
    })
  },
  deleteTournamentResult: (param) => {
    const sql = 'DELETE FROM tournament_results WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.run(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(param)
      })
    })
  }
}
