const tournamentModel = require('../models/tournament')
const leaderboardModel = require('../models/leaderboard')
const qs = require('querystring')
const moment = require('moment')
const {APP_URL} = process.env

const getPage = (_page) => {
  const page = parseInt(_page)
  if (page && page > 0) {
    return page
  } else {
    return 1
  }
}

const getPerPage = (_perPage) => {
  const perPage = parseInt(_perPage)
  if (perPage && perPage > 0) {
    return perPage
  } else {
    return 100
  }
}

const getNextLinkQueryString = (page, totalPage, currentQuery) => {
  page = parseInt(page)
  if (page < totalPage) {
    const generatedPage = {
      page: page + 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

const getPrevLinkQueryString = (page, currentQuery) => {
  page = parseInt(page)
  if (page > 1) {
    const generatedPage = {
      page: page - 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

module.exports = {
  createTournamentResult: async (request, response) => {
    const { team_id, position, point, tournament_id } = request.body
    if (team_id !== '' && position !== '' && point !== '' && tournament_id !== '') {
      const tournamentResult = {
        team_id,
        position,
        point,
        tournament_id,
        created_at: moment().format()
      }
      
      // TEAM POINT
      const teamPoint = await leaderboardModel.getTeamById([team_id])
      await leaderboardModel.updateTeamPoint([parseInt(teamPoint[0].point) + parseInt(point), tournamentResult.created_at, team_id])
      
      //USER COIN
      const teamMembers = await leaderboardModel.getTeamMembers([team_id])
      for (let i = 0; i < teamMembers.length; i++) {
        const userMember = await leaderboardModel.getUserById([teamMembers[i].user_id])
        await leaderboardModel.updateUserCoin([parseInt(userMember[0].coin) + parseInt(point), moment().format(), teamMembers[i].user_id])
      }
      
      const result = await tournamentModel.createTournamentResult(tournamentResult)
      if (result) {
        const data = {
          success: true,
          msg: 'Result succesfully added',
          data: tournamentResult
        }
        response.status(201).send(data)
      } else {
        const data = {
          success: false,
          msg: 'Failed to add result',
          data: request.body
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'all form must be filled'
      }
      response.status(400).send(data)
    }
  },
  getTournamentResult: async (request, response) => {
    const fetchTournament = await tournamentModel.getTournamentResult()
    const data = {
      success: true,
      msg: 'Success',
      data: fetchTournament,
    }
    response.status(200).send(data)
  },
  getResultByTournament: async (request, response) => {
    const fetchTournament = await tournamentModel.getResultByTournament([request.params.id])
    const data = {
      success: true,
      msg: 'Success',
      data: fetchTournament,
    }
    response.status(200).send(data)
  },
  updateTournamentResult: async (request, response) => {
    const { id } = request.params
    const { team_id, position, point, tournament_id } = request.body
    const updated_at = moment().format()
    
      if (id !== '') {
        const tournamentData = [
            team_id,
            position,
            point,
            tournament_id,
            updated_at,
            id
        ]

        // REDUCE TEAM POINT
        const tournament = await tournamentModel.getTournamentById([id])
        const prevTeam = await leaderboardModel.getTeamById([tournament[0].team_id])
        const reducePoint = tournament[0].position == 1 ? 5 : tournament[0].position == 2 ? 3 : 2
        const finalReducePoint = parseInt(prevTeam[0].point) - reducePoint 
        await leaderboardModel.updateTeamPoint([finalReducePoint, tournamentData.updated_at, tournament[0].team_id])

        // INCREASE TEAM POINT
        const nextTeam = await leaderboardModel.getTeamById([team_id])
        const increasePoint = parseInt(nextTeam[0].point) + parseInt(point)
        await leaderboardModel.updateTeamPoint([increasePoint, tournamentData.updated_at, team_id])

        // REDUCE USER COIN
        const prevTeamMembers = await leaderboardModel.getTeamMembers([tournament[0].team_id])
        for (let i = 0; i < prevTeamMembers.length; i++) {
          const userMember = await leaderboardModel.getUserById([prevTeamMembers[i].user_id])
          await leaderboardModel.updateUserCoin([parseInt(userMember[0].coin) - parseInt(reducePoint), moment().format(), prevTeamMembers[i].user_id])
        }

        // INCREASE USER COIN
        const nextTeamMembers = await leaderboardModel.getTeamMembers([team_id])
        for (let i = 0; i < nextTeamMembers.length; i++) {
          const userMember = await leaderboardModel.getUserById([nextTeamMembers[i].user_id])
          await leaderboardModel.updateUserCoin([parseInt(userMember[0].coin) + parseInt(point), moment().format(), nextTeamMembers[i].user_id])
        }
        
        const result = await tournamentModel.updateTournamentResult(tournamentData)
        if (result) {
          const data = {
            success: true,
            msg: `Tournament result with id ${request.params.id} updated`,
          }
          response.status(200).send(data)
        } else {
          const data = {
            success: false,
            msg: 'failed to update'
          }
          response.status(400).send(data)
        }
      }
  },
  deleteTournamentResult: async (request, response) => {
    const { id } = request.params

    const tournament = await tournamentModel.getTournamentById([id])
    
    // REDUCE TEAM POINT
    const team = await leaderboardModel.getTeamById([tournament[0].team_id])
    const prevPoint = tournament[0].position == 1 ? 5 : tournament[0].position == 2 ? 3 : 2
    const finalPoint = parseInt(team[0].point) - prevPoint 
    await leaderboardModel.updateTeamPoint([finalPoint, moment().format(), tournament[0].team_id])
    
    // REDUCE USER COIN
    const teamMembers = await leaderboardModel.getTeamMembers([tournament[0].team_id])
    for (let i = 0; i < teamMembers.length; i++) {
      const userMember = await leaderboardModel.getUserById([teamMembers[i].user_id])
      await leaderboardModel.updateUserCoin([parseInt(userMember[0].coin) - parseInt(prevPoint), moment().format(), teamMembers[i].user_id])
    }
    
    const result = await tournamentModel.deleteTournamentResult([id])

    if (result) {
      const data = {
        success: true,
        msg: `Tournament result with id ${request.params.id} deleted`
      }
      response.status(200).send(data)
    } else {
      const data = {
        success: false,
        msg: 'failed to delete'
      }
      response.status(200).send(data)
    }
  }
}