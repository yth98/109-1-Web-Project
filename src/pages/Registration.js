import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import useReg from './useRegistration'
import { Form, Button, Input, message } from 'antd'
import UploadHead from '../components/UploadHead'

function Registration() {
  const { id, password, username, status, success, setId, setPassword, setUsername, setAvatar, checkId, doReg } = useReg()
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const displayStatus = (s) => {
    if (s.msg) {
      const content = {
        content: s.msg,
        duration: 0.8,
      }
      switch (s.type) {
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
      {success ? <Redirect to={'/chat'} /> : <></>}
      <div className="App-title">
        <h1>iChat 註冊</h1>
        <p>愛聊生活，就從今天開始</p>
      </div>
      <div className="Registration-avatar">
        <UploadHead setAvatar={setAvatar} />
      </div>
      <Form onFinish={doReg} {...layout}>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { type: 'email', message: 'The input is not a valid E-mail!', },
            { required: true, message: 'Please enter your E-mail!', },
        ]}>
        <Input
          value={id}
          placeholder="使用者ID EX：gmail"
          onChange={e => setId(e.target.value)}
          onBlur={checkId}
        />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!', },
          ]}
          hasFeedback
        >
        <Input.Password
          value={password}
          placeholder="密碼"
          onChange={e => setPassword(e.target.value)}
        />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please enter your username!', },
          ]}
        >
        <Input
          value={username}
          placeholder="使用者名稱"
          onChange={e => setUsername(e.target.value)}
        />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="Confirm-btn" type="primary" htmlType="submit">確認</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Registration
