import React, { useEffect } from 'react'
import useReg from './useRegistration'
import { Form, Button, Input, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { set } from 'mongoose'
import UploadHead from "../components/UploadHead"

function Registration() {
  const { id, password, username, avatar, status, setId, setPassword, setUsername, setAvatar, checkId, doReg } = useReg()
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
        <img alt="" src={avatar} />
        <UploadHead />
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
          onChange={(e) => setId(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setUsername(e.target.value)}
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
