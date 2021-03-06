import { useState } from 'react'
import instance from '../axios'

const useLogin = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [status, setStatus] = useState({})
  const [success, setSuccess] = useState(false)

  const changeId = async (Id) => {
    setId(Id)
    if (Id.length) {
      instance.get('/profile', { params: { Id } })
      .then(res => {
        setUsername(res.data.username)
        setAvatar(res.data.avatar)
      })
      .catch(err => setStatus({ type: 'danger', msg: err.response ? err.response.data.msg : err }))
    }
    else {
      setUsername('')
      setAvatar(null)
    }
  }

  const doLogin = async () => {
    if (!id.length || !password.length) return
    instance.post('/login', { id, password }, { withCredentials: true })
    .then(res => {
      setSuccess(res.data.status)
      if (!res.data.status) setStatus({ type: 'danger', msg: res.data.msg })
    })
    .catch(err => setStatus({ type: 'danger', msg: err.response ? err.response.data.msg : err }))
  }

  return {
    id,
    password,
    username,
    avatar,
    status,
    success,
    changeId,
    setPassword,
    doLogin,
  }
}

export default useLogin
