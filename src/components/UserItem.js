import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import instance from '../axios'

const UserItem = props => {
  const { UID, isOnline, isConversataion, recent, onClick } = props
  let StatusColor = (isOnline === true) ? "status green" : "status orange"
  let Status = (isOnline === true) ? "online" : "offline"
  let [PictureURL, setPicture] = useState('/favicon.ico')
  let [Name, setName] = useState('')
  let [Message, setMessage] = useState('')

  useEffect(() => {
    if (!UID || !UID.length) return
    instance.get('/profile', { params: { Id: UID }, withCredentials: true })
    .then(res => {
      if (res.data.user_id) {
        setName(res.data.username)
        setPicture(res.data.avatar)
        setMessage(res.data.lastmsg)
      }
    })
    .catch(err => console.log(err))
  },
  [UID, recent])

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
  isOnline: PropTypes.bool.isRequired,
}
UserItem.defaultProps = {
  isOnline: false,
}

export default UserItem
