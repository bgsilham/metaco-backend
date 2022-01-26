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
  getLeaderboardUser: async (request, response) => {
    const fetchLeaderboard = await leaderboardModel.getLeaderboardUser(request.query.search)
    const data = {
      success: true,
      msg: 'Success',
      data: fetchLeaderboard,
    }
    response.status(200).send(data)
  },
  getLeaderboardTeam: async (request, response) => {
    const fetchLeaderboard = await leaderboardModel.getLeaderboardTeam(request.query.search)
    const data = {
      success: true,
      msg: 'Success',
      data: fetchLeaderboard,
    }
    response.status(200).send(data)
  },
}