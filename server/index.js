require('dotenv-defaults').config()

const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const WebSocket = require('ws')

const ApiRoute = require('./routes/api')

const User = require('./models/user')
const Conversation = require('./models/conversation')
const Message = require('./models/message')

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

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

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
        case 'init' : {
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
        case 'input': {
          if (connectionInfo === null) {
            sendStatus({ type: 'danger', msg: 'You have no permission to send messages.' })
            break
          }
          const newMessage = {
            ...payload[0],
            conversation_id: connectionInfo.conv,
            sender: connectionInfo.user,
            timestamp: Date.now(),
          }
          Message.insertMany([newMessage], (err) => {
            if (err) throw err
            Message.find()
              .limit(100)
              .sort({ _id: 1 })
              .exec((err, res) => {
                if (err) throw err
                let I = res.findIndex(d => d._id===payload[1])
                if (I >= 0)
                  sendData(['output', res.slice(I+1)])
                else {
                  sendData(['cleared'])
                  sendData(['output', res])
                }
              })
          })
          break
        }
        case 'clear': {
          if (connectionInfo === null) {
            sendStatus({ type: 'danger', msg: 'You have no permission to clear messages.' })
            break
          }
          Message.deleteMany({}, () => {
            sendData(['cleared'])
            sendStatus({ type: 'info', msg: 'Messages cleared.' })
          })
          break
        }
        default:
          break
      }
    }
  })

  const PORT = process.env.port || 4000

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})
