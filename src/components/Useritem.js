import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const UserItem = props => {
  const { UID, isOnline, onClick, isConversataion } = props
  let StatusColor = (isOnline === true) ? "status green" : "status orange"
  let Status = (isOnline === true) ? "online" : "offline"
  let [PictureURL, setPicture] = useState('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg')
  let [Name, setName] = useState('')
  let [Message, setMessage] = useState('I\'m keeping going until dead line coming')

  useEffect(() => {
    if (!UID || !UID.length) return
    instance.get('/profile', { params: { Id: UID } })
    .then(res => {
      if (res.data.user_id) {
        setName(res.data.username)
        setPicture(res.data.avatar)
        setMessage('going until deadline')
      }
    })
    .catch(err => console.log(err))
  },
  [UID])

  return (
    <li key={UID} className={isConversataion?"conv-item":undefined} onClick={onClick}>
      <img src={PictureURL} alt={Name} />
      <div>
        <h2>{Name}</h2>
        <h2 style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{Message}</h2>
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
