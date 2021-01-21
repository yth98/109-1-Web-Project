import { useState } from 'react'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const useLogin = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [status, setStatus] = useState({})
  const [success, setSuccess] = useState(false)

  const changeId = async (Id) => {
    setId(Id)
    if (Id.length) {
      instance.get('/profile', { params: { Id } })
      .then(res => setAvatar(res.data.avatar))
      .catch(err => console.log(err))
    }
    else setAvatar(null)
  }

  const doLogin = async () => {
    if (!id.length || !password.length) return
    instance.post('/login', { id, password }, { withCredentials: true })
    .then(res => {
      setSuccess(res.data.status)
      if (!res.data.status) setStatus({ type: 'danger', msg: res.data.msg })
    })
    .catch(err => setStatus({ type: 'danger', msg: err.response.data.msg }))
  }

  return {
    id,
    password,
    avatar,
    status,
    success,
    changeId,
    setPassword,
    doLogin,
  }
}

export default useLogin
