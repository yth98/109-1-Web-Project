import axios from 'axios'

const URL_BASE = process.env.URL_BASE || 'localhost'
const PORT_SERVER = process.env.PORT_SERVER || 4000
console.log('axios', URL_BASE, PORT_SERVER)
const instance = axios.create({ baseURL: `http://${URL_BASE}:${PORT_SERVER}/api` })

export default instance
