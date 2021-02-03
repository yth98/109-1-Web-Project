import axios from 'axios'

const URL_BASE = process.env.REACT_APP_URL_BASE || 'localhost'
const PORT_SERVER = process.env.REACT_APP_PORT_SERVER || 4000
console.log('axios', URL_BASE, PORT_SERVER)
const instance = axios.create({ baseURL: `http://${URL_BASE}:${PORT_SERVER}/api`, withCredentials: true })

export default instance
