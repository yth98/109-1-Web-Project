import React from 'react'
import {HeartOutlined}from "@ant-design/icons"
import {Button } from "antd"
const StickerItem = props => {
  const { } = props
  return (
    <div class="dropup"> 
            {/* <button class="dropbtn"> 
                Sticker 
            </button>  */}
            <Button className="dropbtn" type="primary" icon={<HeartOutlined />}>
              Sticker
            </Button>
            <div class="dropup-content"> 
                <a href="#"> 
                    <img src= 
"https://media.geeksforgeeks.org/wp-content/uploads/20200630132503/iflag.jpg"
                    width="20" height="15"/> India</a> 
  
                <a href="#"> 
                    <img src= 
"https://media.geeksforgeeks.org/wp-content/uploads/20200630132504/uflag.jpg"
                    width="20" height="15"/> USA</a> 
                <a href="#"> 
                    <img src= 
"https://media.geeksforgeeks.org/wp-content/uploads/20200630132502/eflag.jpg"
                    width="20" height="15"/> England</a> 
                <a href="#"> 
                    <img src= 
"https://media.geeksforgeeks.org/wp-content/uploads/20200630132500/bflag.jpg"
                    width="20" height="15"/> Brazil</a> 
            </div> 
        </div>
    
    
  )
}

export default StickerItem
