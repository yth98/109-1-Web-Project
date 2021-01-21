import React from 'react'
import { HeartOutlined }from "@ant-design/icons"
import { Button } from "antd"

const StickerItem = props => {
  const { HandleEmojih, HandleEmojia, HandleEmojis, HandleEmojic, HandleEmojil } = props
  return (
    <div class="dropup"> 
      <Button className="dropbtn" type="primary" icon={<HeartOutlined />}>
        emoji
      </Button>
      <div class="dropup-content"> 
          <a onClick={HandleEmojih}> 😆happy</a>
          <a onClick={HandleEmojia}> 🤬angury</a>
          <a onClick={HandleEmojis}> 😖scared</a>
          <a onClick={HandleEmojic}> 😭cry</a>
          <a onClick={HandleEmojil}> 💕love</a>
      </div>
    </div>
  )
}

export default StickerItem
