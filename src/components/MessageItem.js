import React from 'react'

const MessageItem = props => {
  const { Sendername, Time, Message, isI } = props
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
    </li>
  )
}

export default MessageItem
