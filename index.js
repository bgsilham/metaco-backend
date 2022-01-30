require('dotenv').config()
// const {APP_PORT} = process.env
const PORT = 80
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

const server = require('http').createServer(app)

app.get('/',(request,response) => {
    response.send('Server accessed')
})

//import 
const tournament = require('./src/routes/tournament')
const leaderboard = require('./src/routes/leaderboard')

app.use('/tournament/result', tournament)
app.use('/leaderboard', leaderboard)

app.get('*', (request,response) => {
    response.status(404).send('Page Not found')
})

server.listen (PORT, () => {
   console.log(`App is listening`)
})