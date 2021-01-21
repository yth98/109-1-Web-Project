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
    uid,
    status,
    talking,
    conversations_ready,
    conversations,
    messages_ready,
    messages,
    search,
    setUID,
    setID,
    setConversation,
    sendMessage,
    modifyMessage,
    deleteMessage,
    searchCancel,
    searchInUser,
    searchInConv,
  } = useChat()

  const { Header, Footer, Sider, Content } = Layout
  const { SubMenu } = Menu
  const [body, setBody] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const [adduser, setAdduser] = useState("")
  const [word, setWord] = useState("")
  const [msg, setMsg] = useState("")
  const bodyRef = useRef(null)

  const userItems = conv => {
    const other = conv.member_2 === uid ? conv.member_1 : conv.member_2
    return <UserItem
      key={other}
      PictureURL={other}
      Name={other}
      isOnline={true}
      onClick={() => setConversation(conv._id)}
    />
  }

  const messageItems = msg => {
    const time = new Date(msg.time)
    const id = msg._id
    switch (msg.type) {
      case "TEXT":
      default:
        return <MessageItem
          key={msg._id}
          Sendername={msg.send}
          Time={time.toLocaleDateString()+" "+time.toLocaleTimeString()}
          Message={msg.body}
          isI={msg.send === uid}
          handleDelete = {()=>deleteMessage(msg._id)}
          // handleDelete = {()=>setID(msg._id)}
        />
      case "IMAGE":
        return <></>
      case "STICKER":
        return <></>
      case "ATTACHMENT":
        return <></>
    }
  }

  const sendText = () => {
    if (!msg.length) return
    sendMessage("TEXT", msg)
    setMsg("")
  }

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    if (status.msg) {
      const content = {
        content: status.msg,
        duration: 0.5,
      }
      switch (status.type) {
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
  }, [status])

  return (
    <Layout>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={collapsed => setCollapsed(collapsed)} > */}
      <Sider>
        <ul>
          <UserItem Name="Alice" LatestMessage="" />
          <AddUserItem Value={[adduser, setAdduser]} />
          {
            conversations_ready
            ? conversations.map(conv => userItems(conv))
            : <></>
          }
        </ul>
      </Sider>
      <Layout>
        <Header className="header">
          {
            talking ? <>
              <div className="left">
                <img src={talking.photo} alt={talking.name} style={{borderradius: "100%"}} />
              </div>
              <div className="left">
                <h2 style={{color:"#bbb"}}>{talking.name}</h2>
              </div>
            </> : <></>
          }
          <div className="right">
            <Tooltip title="search">
              <Button shape="circle" icon={<SearchOutlined />} onClick={() => searchInConv(word)} />
            </Tooltip>
          </div>
          <div className="right">
            <Input onChange={e => setWord(e.target.value)} onPressEnter={() => searchInConv(word)} />
          </div>
          <div className="right" style={{color: "white"}}>
            {search ? "[Searching]" : ""}
          </div>
        </Header>
        <Content style={{ margin: "90 20 90 30" }}>
          <ul id="chat">
          {
            messages_ready
            ? messages.map(msg => messageItems(msg))
            : <></>
          }
          </ul>
        </Content>
        <Footer className="Footer" style={{ backgroundColor: "#102a52", margin: "1 2 3 5" }}>
          <div>
            <Button type="primary" icon={<HeartOutlined />}>
              Sticker
            </Button>
          </div>
          <div style={{ flex: "auto" }}>
            <Input value={msg} placeholder="Type your message" onChange={e => setMsg(e.target.value)} onPressEnter={sendText} />
          </div>
          <div>
            <Button type="primary" icon={<SendOutlined />} style={{ margin: "8 8 8 9" }} onClick={sendText}>
              Send
            </Button>
          </div>
          <div>
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>
                Photos
              </Button>
            </Upload>
          </div>
        </Footer>
      </Layout>
    </Layout>
  )
}

export default Chat
