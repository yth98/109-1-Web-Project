import React, { useEffect, useRef, useState } from 'react'
import useChat from './useChat'
import { Button, Input, message, Tag } from 'antd'

function Chat() {
  const { username, status, opened, messages, sendMessage, clearMessages } = useChat()

  const [body, setBody] = useState('')

  const bodyRef = useRef(null)

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
        <Button type="primary" danger onClick={clearMessages}>
          Clear
        </Button>
      </div>
      <div className="App-messages">
        {messages.length === 0 ? (
          <p style={{ color: '#ccc' }}>
            {opened ? 'No messages...' : 'Loading...'}
          </p>
        ) : (
          messages.map(({ sender, body }, i) => (
            <p className="App-message" key={i}>
              <Tag color="blue">{sender}</Tag> {body}
            </p>
          ))
        )}
      </div>
      <Input
        value={username}
        style={{ marginBottom: 10 }}
        disabled
      ></Input>
      <Input.Search
        rows={4}
        value={body}
        ref={bodyRef}
        enterButton="Send"
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message here..."
        onSearch={(msg) => {
          if (!msg) {
            displayStatus({
              type: 'error',
              msg: 'Please enter a message body.'
            })
            return
          }
          sendMessage({ type: 'text', body: msg })
          setBody('')
        }}
      ></Input.Search>
    </div>
  )
}

export default Chat
