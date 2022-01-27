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
    const sql = `SELECT tournament_results.id, tournament_results.team_id, teams.name as team_name, tournament_results.position, tournament_results.tournament_id FROM tournament_results INNER JOIN teams ON tournament_results.team_id=teams.id WHERE tournament_results.tournament_id = ? AND tournament_results.position = ?`
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
