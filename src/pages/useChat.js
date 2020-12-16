import { useState } from 'react'
// import { w3cwebsocket as W3CWebSocket } from 'websocket'

// const client = new W3CWebSocket('ws://localhost:4000')
const client = new WebSocket('ws://localhost:4000')

const useChat = () => {
  const [username, setUsername] = useState(Math.random()>=0.5 ? 'Alice' : 'Bob')
  const [status, setStatus] = useState({})
  const [opened, setOpened] = useState(false)
  const [messages, setMessages] = useState([])
  const [lastId, setLastId] = useState(0)

  client.onmessage = (message) => {
    const { data } = message
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case 'authSuccess': {
        setUsername(() => payload.user)
        setOpened(true)
        break
      }
      case 'init': {
        setMessages(() => payload)
        if (payload.length)
          setLastId(() => payload[payload.length-1]._id)
        break
      }
      case 'output': {
        setMessages(() => [...messages, ...payload])
        if (payload.length)
          setLastId(() => payload[payload.length-1]._id)
        break
      }
      case 'status': {
        setStatus(payload)
        break
      }
      case 'cleared': {
        setMessages([])
        break
      }
      default:
        break
    }
  }

  client.onopen = () => {
    sendData(['init', {user_id: username, conv_id: 'Alice_Bob', credential: 'secret'}])
  }

  const sendData = (data) => {
    client.send(JSON.stringify(data))
  }

  const sendMessage = (msg) => {
    sendData(['input', [msg, lastId]])
  }

  const clearMessages = () => {
    sendData(['clear'])
  }

  return {
    username,
    status,
    opened,
    messages,
    sendMessage,
    clearMessages
  }
}

export default useChat
