import { useState } from 'react'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const useLogin = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
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

  const doLogin = async () => {
    if (!id.length || !password.length) return
    instance.post('/login', { id, password }, { withCredentials: true })
    .then(res => {
      if (res.data.status)
        setStatus({ type:'success', msg:`Hello, ${id}.` })
      else
        setStatus({ type:'danger', msg:`Incorrect password.` })
    })
    .catch(err => console.log(err))
  }

  return {
    id,
    password,
    avatar,
    status,
    changeId,
    setPassword,
    doLogin
  }
}

export default useLogin