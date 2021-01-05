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
          <h1>iChat 註冊</h1>
          <p>歡迎啟動愛聊生活</p>
        </div>
        <div className="Registration-avatar">
        <img  alt="" src={avatar} />
        
        <img  alt="" src={avatar} />
        </div>
        <Form onFinish={doLogin}>
          <Form.Item>
            <Input
              value={id}
              placeholder="使用者ID EX：gmail"
              onChange={(e) => changeId(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
            value={password}
            placeholder="密碼"
            onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
            value={password}
            placeholder="使用者名稱"
            onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button className="Confirm-btn" type="primary" htmlType="submit">確認</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
  
  export default Login
  