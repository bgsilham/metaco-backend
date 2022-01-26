const db = require('../utils/db')

module.exports = {
  getLeaderboardUser: (search) => {
    const sql = `SELECT * FROM users WHERE name LIKE '${search || ''}%' ORDER BY coin DESC`
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
  getLeaderboardTeam: (search) => {
    const sql = `SELECT teams.name, teams.logo, teams.point, users.name as captain FROM teams INNER JOIN users ON teams.captain_id=users.id WHERE teams.name LIKE '${search || ''}%' ORDER BY point DESC`
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
  getTeamById: (param) => {
    const sql = `SELECT * FROM teams WHERE id = ?`
    return new Promise((resolve, reject) => {
      db.all(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getUserById: (param) => {
    const sql = `SELECT * FROM users WHERE id = ?`
    return new Promise((resolve, reject) => {
      db.all(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getTeamMembers: (param) => {
    const sql = `SELECT * FROM team_members WHERE team_id = ?`
    return new Promise((resolve, reject) => {
      db.all(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateUserCoin: (param) => {
    const sql = `UPDATE users SET coin = ?, updated_at = ? WHERE id = ?`
    return new Promise((resolve, reject) => {
      db.run(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateTeamPoint: (param) => {
    const sql = `UPDATE teams SET point = ?, updated_at = ? WHERE id = ?`
    return new Promise((resolve, reject) => {
      db.run(sql, param, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
}
