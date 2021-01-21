import React, { useEffect } from 'react'
import useLogin from './useLogin'
import { Form, Button, Input, message } from 'antd'

function Login() {
  const { id, password, avatar, status, changeId, setPassword, doLogin } = useLogin()

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5
      }

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'danger':
        default:
          message.error(content)
          break
      }
    }
  }

  useEffect(() => {
    displayStatus(status)
  }, [status])

  return (
    <div className="App">
      <div className="App-title">
        <h1>iChat</h1>
        <p>啟動愛聊生活</p>
      </div>
      <img className="Login-avatar" alt="" src={avatar} />
      <Form onFinish={doLogin}>
        <Form.Item>
          <Input
            value={id}
            placeholder="登入ID"
            onChange={e => changeId(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            value={password}
            placeholder="密碼"
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button className="Login-btn" type="primary" htmlType="submit">登入</Button>
          <Button className="Registration-btn" type="primary" htmlType="submit" style={{ margin: '0 8px', }}>註冊</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
