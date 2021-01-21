import { useState } from 'react'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const useReg = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [status, setStatus] = useState({})
  const [success, setSuccess] = useState(false)

  const checkId = async () => {
    if (id.length) {
      instance.get('/profile', { params: { Id: id } })
      .then(res => {if (res.data.user_id) setStatus({ type: 'danger', msg: '這個E-mail已經被註冊過了。' })})
      .catch(err => {if (err.response && 'data' in err.response) setStatus({ type: 'danger', msg: err.response.data.msg })})
    }
  }

  const doReg = async () => {
    if (!id.length || !password.length) return
    instance.post('/register', { id, password, username, avatar }, { withCredentials: true })
    .then(res => {
      setSuccess(res.data.status)
      if (!res.data.status) setStatus({ type: 'danger', msg: res.data.msg })
    })
    .catch(err => setStatus({ type: 'danger', msg: err.response.data.msg }))
  }

  return {
    id,
    password,
    username,
    avatar,
    status,
    success,
    setId,
    setPassword,
    setUsername,
    setAvatar,
    checkId,
    doReg
  }
}

export default useReg
