import React, { useEffect, useRef, useState } from "react"
import useChat from "./useChat"
import { Upload, Layout, Button, Input, message, Menu, Tooltip } from "antd"
import UserItem from "../components/Useritem"
import AddUserItem from "../components/AddUseritem"
import MessageItem from "../components/MessageItem"
import {
  HeartOutlined,
  SendOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons"
function Chat() {
  const {
    username,
    status,
    opened,
    messages,
    sendMessage,
    clearMessages,
  } = useChat()

  const { Header, Footer, Sider, Content } = Layout
  const { SubMenu } = Menu
  let sendfunction
  const [body, setBody] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const bodyRef = useRef(null)
  let messagetest = [{sender:"ric", body:"hi"}]
  let messagetest1 = [{sender:"bob", body:"hi"}]
  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5,
      }

      switch (type) {
        case "success":
          message.success(content)
          break
        case "info":
          message.info(content)
          break
        case "danger":
        default:
          message.error(content)
          break
      }
    }
  }

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    displayStatus(status)
  }, [status])

  return (
    <Layout>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={collapsed => setCollapsed(collapsed)} > */}
      <Sider >
        <ul>
          <UserItem Name="User0" LatestMessage="hero" />
          <AddUserItem />
          <UserItem />
          <UserItem PictureURL="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_02.jpg" Name="林育世" isOnline={true} />
        </ul>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="left">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" style={{borderradius: "50%"}} />   
          </div>
          <div className="left">
            <h2 style={{color:"#bbb"}}>name</h2>
          </div>
          <div className="right">
            <Tooltip title="search">
              <Button shape="circle" icon={<SearchOutlined />} />
            </Tooltip>
          </div>
          <div className="right">
            <Input />
          </div>
        </Header>
        <Content style={{ margin: "90 20 90 30" }}>
          <ul id="chat">
          <MessageItem Sendername = "yu-shih" Time = "sunday afternoon" Message = "i'm full !!" isI = {true} ></MessageItem>
            <MessageItem Sendername = "yu-shih" Time = "sunday afternoon" Message = "i'm full !!" isI = {true} ></MessageItem>
            <MessageItem Sendername = "yu-shih" Time = "sunday afternoon" Message = "i'm full !!" isI = {false} ></MessageItem>
            <li class="you">
              <div class="entete">
                <span class="status green"></span>
                <h2>Vincent</h2>
                <h3>10:12AM, Today</h3>
              </div>
              <div class="triangle"></div>
              <div class="message">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              </div>
            </li>
            <li class="me">
              <div class="entete">
                <h3>10:12AM, Today</h3>
                <h2>Vincent</h2>
                <span class="status blue"></span>
              </div>
              <div class="triangle"></div>
              <div class="message">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              </div>
            </li>
            <li class="me">
              <div class="entete">
                <h3>10:12AM, Today</h3>
                <h2>Vincent</h2>
                <span class="status blue"></span>
              </div>
              <div class="triangle"></div>
              <div class="message">
                OK
              </div>
            </li>
          </ul>
        </Content>
        <Footer className="Footer" 
        style={{backgroundColor: "#102a52" ,margin:"1 2 3 5"
        
        }}>
          <div>
          <Button type="primary" icon={<HeartOutlined />}>
            Sticker
          </Button>
          </div>
            <div>
              <Input placeholder="Type your message"/>
            </div>
            <div>
          <Button type="primary" icon={<SendOutlined />} style={{ margin:"8 8 8 9" }}>
            Send
          </Button>
            </div>
          <div>
          <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />} 
         >Photos</Button>
          </Upload>
          </div>
        </Footer>
      </Layout>
    </Layout>
  )
}

export default Chat
