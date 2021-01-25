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

const jwt = require('jsonwebtoken')

// express
const app = express()
const HTTPserver = http.createServer(app)
const wss = new WebSocket.Server({ server: HTTPserver })

const URL_BASE = process.env.URL_BASE || 'localhost'
const PORT = process.env.PORT || 3000
const PORT_SERVER = process.env.PORT_SERVER || 4000
const PORT_GQL = process.env.PORT_GQL || 4200
const buildPath = path.resolve(__dirname + '/../build')
console.log(`Allow CORS from http://${URL_BASE}:${PORT}`)
app.use(cors({ credentials: true, origin: (origin, callback) => {
  if ([`http://${URL_BASE}:${PORT}`, `http://ichat.${URL_BASE}`].indexOf(origin) !== -1)
    callback(null, true)
  else
    callback(null, false)
} }))
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

  // RESTful API
  HTTPserver.listen(PORT_SERVER, () => {
    console.log(`Listening on http://localhost:${PORT_SERVER}`)
  })

  // GraphQL
  const pubsub = new PubSub()
  const GQLserver = new GraphQLServer({
    typeDefs: './server/schema.graphql',
    resolvers: {
      Query,
      Mutation,
      Subscription,
    },
    context: {
      User,
      Conv,
      Message,
      pubsub,
    },
  })
  GQLserver.start({
    port: PORT_GQL,
    playground: false,
  }, () => console.log(`GraphQL server is running on http://localhost:${PORT_GQL}`))

  // WebSocket
  wss.on('connection', ws => {
    let connectionInfo = null
    ws.send(JSON.stringify([111,222]))

    const sendData = (data) => {
      ws.send(JSON.stringify(data))
    }

    const sendStatus = (s) => {
      sendData(['status', s])
    }

    ws.onmessage = async (message) => {
      const { data } = message
      console.log('ws', data)
      const [task, payload] = JSON.parse(data)

      switch (task) {
        case 'auth' : {
          if (payload.credential === 'secret') {
            sendData(['authSuccess', { uid: payload.user_id }])
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
