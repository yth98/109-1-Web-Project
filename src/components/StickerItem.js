import React, { useState } from 'react'
import { HeartOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Button } from 'antd'

const StickerItem = props => {
  const { appendEmoji, disabled } = props
  const [visible, setVisible] = useState(false)
  const emojis = [
    { e: '😆', t: 'happy', },
    { e: '🤬', t: 'angry', },
    { e: '😖', t: 'scared', },
    { e: '😭', t: 'cry', },
    { e: '💕', t: 'love', },
  ]
  const menu = (
    <Menu className="dropup">{
      emojis.map(emoji => <Menu.Item key={emoji.e} onClick={() => appendEmoji(emoji.e)}>{emoji.e} {emoji.t}</Menu.Item>)
    }</Menu>
  )
  return (
    <Dropdown
      disabled={disabled}
      overlay={menu}
      placement="topCenter"
      visible={visible}
      onVisibleChange={flag => setVisible(flag)}
    >
      <Button className="dropbtn" type="primary" icon={<HeartOutlined />}>
        emoji
      </Button>
    </Dropdown>
  )
}

export default StickerItem
