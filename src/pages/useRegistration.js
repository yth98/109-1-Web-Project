import { useState } from 'react'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const useReg = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [status, setStatus] = useState({})

  const checkId = async () => {
    if (id.length) {
      instance.get('/profile', { params: { Id: id } })
      .then(res => {if (res.data.user_id) setStatus({ type:'danger', msg:`This E-mail has been used.` })})
      .catch(err => console.log(err))
    }
  }

  const doReg = async () => {
    if (!id.length || !password.length) return
    instance.post('/register', { id, password, username, avatar }, { withCredentials: true })
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
    setId,
    setPassword,
    setUsername,
    setAvatar,
    checkId,
    doReg
  }
}

export default useReg
