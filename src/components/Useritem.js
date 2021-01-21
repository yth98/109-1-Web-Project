import React from 'react'
import PropTypes from 'prop-types'

const UserItem = props => {
  const { PictureURL, Name, isOnline, LatestMessage, onClick } = props
  let StatusColor = (isOnline === true) ? "status green" : "status orange"
  let Status = (isOnline === true) ? "online" : "offline"
  let latestmessage = LatestMessage

  return (
    <li onClick={onClick}>
      <img src={PictureURL} alt={Name} />
      <div>
        <h2>{Name}</h2>
        <h2>{(latestmessage.length > 10)?(latestmessage.substring(0,9)+' ...'):(latestmessage)}</h2>
      </div>
      <h3>
        <span className={StatusColor}></span>
        {Status}
      </h3>
    </li>
  )
}

UserItem.propTypes = {
  PictureURL: PropTypes.string,
  Name: PropTypes.string,
  isOnline:PropTypes.bool.isRequired,
  LatestMessage:PropTypes.string,
}
UserItem.defaultProps = {
  PictureURL: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg",
  Name: "Prénom Nom",
  isOnline: false,
  LatestMessage: "I'm keeping going until dead line coming",
}

export default UserItem
