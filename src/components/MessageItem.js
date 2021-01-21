import React from 'react'
import {EditOutlined ,DeleteOutlined} from "@ant-design/icons"

const MessageItem = props => {
  const { Sendername, Time, Message, isI ,handleDelete} = props
  return (
    <li className={isI ? "me" : "you"}>
      
      {isI
        ?
        <div className="entete">
          <h3>{Time}</h3>
          <h2>{Sendername}</h2>
          <span className="status blue"></span>
        </div>
        :
        <div className="entete">
          <span className="status green"></span>
          <h2>{Sendername}</h2>
          <h3>{Time}</h3>
        </div>
      }
      

      <div className="triangle"></div>
      <div className="message">
        {Message}
        
      </div>
      <DeleteOutlined id="delete" onClick={handleDelete}/>
    </li>
  )
}

export default MessageItem
