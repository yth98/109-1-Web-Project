require('dotenv-defaults').config()

const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const WebSocket = require('ws')

const ApiRoute = require('./routes/api')

const { User, Conv, Message } = require('./models')
const { Query, Mutation, Subscription } = require('./resolvers')
const { GraphQLServer, PubSub } = require('graphql-yoga')

// express
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const buildPath = path.resolve(__dirname + '/../build')
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(bodyParser.json())
app.use(cookieParser('7463847412'))
app.use(express.static(buildPath))
app.use('/api', ApiRoute)
app.get('/*', (req, res) => res.sendFile(buildPath + '/index.html'))

// Mongoose
if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true)

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

  // GraphQL
  const pubsub = new PubSub()
  const server = new GraphQLServer({
    typeDefs: './server/schema.graphql',
    resolvers: {
      Query,
      Mutation,
      Subscription
    },
    context: {
      User,
      Conv,
      Message,
      pubsub
    }
  })
  server.start({port: 4200}, () => console.log('GraphQL server is running on localhost:4200'))

  // WebSocket
  wss.on('connection', ws => {
    let connectionInfo = null

    const sendData = (data) => {
      ws.send(JSON.stringify(data))
    }

    const sendStatus = (s) => {
      sendData(['status', s])
    }

    ws.onmessage = (message) => {
      const { data } = message
      console.log(data)
      const [task, payload] = JSON.parse(data)

      switch (task) {
        case 'auth' : {
          if (payload.credential === 'secret') {
            connectionInfo = { user: payload.user_id, conv: payload.conv_id }
            sendData(['authSuccess', { user: connectionInfo.user }])
            Message.find()
              .limit(100)
              .sort({ _id: 1 })
              .exec((err, res) => {
                if (err) throw err
                sendData(['init', res])
              })
          } else sendStatus({ type: 'danger', msg: 'Authorization failed.' })
          break
        }
        default:
          break
      }
    }
  })
})
