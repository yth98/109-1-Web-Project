import { useState } from 'react'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const useReg = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [status, setStatus] = useState({})

  const changeId = async (Id) => {
    setId(Id)
    if (Id.length) {
      instance.get('/avatar', { params: { Id } })
      .then(res => setAvatar(res.data.url))
      .catch(err => console.log(err))
    }
    else setAvatar(null)
  }

  const doReg = async () => {
    if (!id.length || !password.length) return
    instance.post('/register', { id, password, username }, { withCredentials: true })
    .then(res => {
      if (res.data.status)
        setStatus({ type:'success', msg:`Welcome, ${id}.` })
      else
        setStatus({ type:'danger', msg:`Registration failed.` })
    })
    .catch(err => console.log(err))
  }

  return {
    id,
    password,
    username,
    avatar,
    status,
    changeId,
    setPassword,
    setUsername,
    doReg
  }
}

export default useReg
