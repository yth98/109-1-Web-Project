import React, { useEffect, useRef, useState } from "react";
import useChat from "./useChat";
import { Layout, Button, Input, message, Tag, Menu, Breadcrumb } from "antd";
import UserItem from "../components/Useritem";
import AddUserItem from "../components/AddUseritem";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  HeartOutlined,
  FileImageOutlined,
  SendOutlined  
} from "@ant-design/icons";
function Chat() {
  const {
    username,
    status,
    opened,
    messages,
    sendMessage,
    clearMessages,
  } = useChat();

  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  let sendfunction
  const [body, setBody] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const bodyRef = useRef(null);
  let messagetest = [{sender:"ric", body:"hi"}]
  let messagetest1 = [{sender:"bob", body:"hi"}]
  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s;
      const content = {
        content: msg,
        duration: 0.5,
      };

      switch (type) {
        case "success":
          message.success(content);
          break;
        case "info":
          message.info(content);
          break;
        case "danger":
        default:
          message.error(content);
          break;
      }
    }
  };

  useEffect(() => {
    displayStatus(status);
  }, [status]);
  const onCollapse = (collapsed) => {
    console.log(collapsed);
    if (collapsed) {
      setCollapsed(true);
    }else{
      setCollapsed(false)
    }

  };
  return (
    
    <Layout style={{ minHeight: "-10em" }}>
      
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} >
        <div className="logo" />
        
        <ul>
        <UserItem  Name="User0" LatestMessage="hero" />
        <AddUserItem/>  
        <UserItem  />
        <UserItem PictureURL="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_02.jpg" Name="林育世" isOnline={true} />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        <UserItem  />
        </ul>
        
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ 
         margin: "auto auto auto auto", width: "1500px",height:"100px" }} >
        <div>
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt=""/>   
        </div>
        <div >
        <h2>name</h2>
        </div>
        <div>
        <Input.Search />
        
        </div>
        
        
        </Header>   
        <Content style={{ margin: "0 16px" }}>
        <ul id="chat">
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
        <Footer className="Footer">
        <Button type="primary" icon={<FileImageOutlined />}>
      Photos
    </Button>
    <Button type="primary" icon={<HeartOutlined  />}>
      Sticker
    </Button>
        
        <div>  
        <Input placeholder="Type your message"/>
        </div>
        <Button type="primary" icon={<SendOutlined  />}>
      Send
    </Button>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Chat;
