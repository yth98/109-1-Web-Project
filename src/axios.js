import axios from 'axios'

const URL_BASE = process.env.URL_BASE || 'localhost'
const PORT = process.env.PORT || 4000
console.log('axios', URL_BASE, PORT)
const instance = axios.create({ baseURL: `http://${URL_BASE}:${PORT}/api` })

export default instance
