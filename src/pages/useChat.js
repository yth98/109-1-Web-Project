import { useEffect, useState } from 'react'
import { USER_QUERY, CONVS_QUERY, MSGS_QUERY, MSGS_IN_USER_CONVS_QUERY, MSGS_IN_CONV_QUERY } from '../graphql'
import { CREATE_CONV_MUT, CREATE_MSG_MUT, UPDATE_MSG_MUT, DELETE_MSG_MUT } from '../graphql'
import { CONV_SUB, MSG_SUB } from '../graphql'
import { useQuery, useMutation } from '@apollo/client'
import instance from '../axios'

const useChat = () => {
  const [tokenready, setTKready] = useState(false)
  // const [wsready, setWSReady] = useState(false)
  const [logout, setLogout] = useState(false)
  const [status, setStatus] = useState({})
  const [uid, setUID] = useState('')
  const [uid2, setUID2] = useState('')
  const [conv, setConversation] = useState('')
  const [keyword, setKeyword] = useState('')
  const [search, setSearch] = useState(0)

  const Conversations = useQuery(CONVS_QUERY, {variables: { uid }})
  const TalkingToUser = useQuery(USER_QUERY, {variables: { uid: uid2 }})
  const Messages = useQuery(MSGS_QUERY, {variables: { conv }})
  const MessagesInUser = useQuery(MSGS_IN_USER_CONVS_QUERY, {variables: { uid, keyword }})
  const MessagesInConv = useQuery(MSGS_IN_CONV_QUERY, {variables: { conv, keyword }})
  const { refetch: ConvRef, subscribeToMore: ConvSub } = Conversations
  const { refetch: TalkRef } = TalkingToUser
  const { refetch: MsgRef, subscribeToMore: MsgSub } = Messages
  const { refetch: MsgUserRef } = MessagesInUser
  const { refetch: MsgConvRef } = MessagesInConv
  const [createConversation] = useMutation(CREATE_CONV_MUT)
  const [createMessage] = useMutation(CREATE_MSG_MUT)
  const [modifyMessage] = useMutation(UPDATE_MSG_MUT)
  const [deleteMessage] = useMutation(DELETE_MSG_MUT)

  const client = new WebSocket('ws://localhost:4000')

  const addUser = async UID => {
    if (uid.length && UID.length) {
      console.log('add', uid, UID)
      instance.get('/profile', { params: { Id: UID } })
      .then(res => {
        if (res.data.user_id)
          createConversation({ variables: { member1: uid, member2: res.data.user_id } })
          .then(user => setConversation(user.data._id))
          .catch(err => setStatus({ type: "danger", msg: err.message }))
        else
          setStatus({ type: "info", msg: "沒這個人！" })
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(() => ConvRef(), [ConvRef, uid])
  useEffect(() => {
    if (!ConvSub || !uid || !uid.length) return
    const unsubscribe = ConvSub({
      document: CONV_SUB,
      variables: { uid },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        switch (subscriptionData.data.conversation.mutation) {
          case 'CREATED':
            return {
              ...prev,
              conversations: [
                ...prev.conversations,
                subscriptionData.data.conversation.payload
              ].sort((a, b) => new Date(b.recent) - new Date(a.recent))
            }
          case 'UPDATED':
            const idx = prev.conversations.findIndex(msg => msg._id === subscriptionData.data.conversation.payload._id)
            return {
              ...prev,
              conversations: idx >= 0 ? [
                ...prev.conversations.slice(0,idx),
                subscriptionData.data.conversation.payload,
                ...prev.conversations.slice(idx+1),
              ].sort((a, b) => new Date(b.recent) - new Date(a.recent)) : prev.conversations
            }
          case 'DELETED':
            if (conv === subscriptionData.data.conversation.payload._id) setConversation('')
            return {
              ...prev,
              conversations: prev.conversations.filter(message => message._id !== subscriptionData.data.conversation.payload._id)
            }
          default:
            return prev
        }
      }
    })
    return () => unsubscribe()
  },
  [ConvSub, uid, conv])

  useEffect(() => {
    if (Conversations.loading || Conversations.error) return false
    const c = Conversations.data.conversations.find(c => c._id === conv)
    setUID2(c ? (uid === c.member_2 ? c.member_1 : c.member_2) : '')
  },
  [Conversations, uid, conv])
  useEffect(() => {
    if (TalkRef && uid2.length) TalkRef()
  },
  [TalkRef, uid2])

  useEffect(() => {
    if (MsgRef && conv && conv.length) MsgRef()
    setSearch(0)
  },
  [MsgRef, conv])
  useEffect(() => {
    if (!MsgSub || !conv || !conv.length) return
    const unsubscribe = MsgSub({
      document: MSG_SUB,
      variables: { uid },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || subscriptionData.data.message.payload.conv !== conv) return prev
        switch (subscriptionData.data.message.mutation) {
          case 'CREATED':
            return {
              ...prev,
              messages: [...prev.messages, subscriptionData.data.message.payload]
            }
          case 'UPDATED':
            const idx = prev.messages.findIndex(msg => msg._id === subscriptionData.data.message.payload._id)
            return {
              ...prev,
              messages: idx >= 0 ? [
                ...prev.messages.slice(0,idx),
                subscriptionData.data.message.payload,
                ...prev.messages.slice(idx+1)
              ] : prev.messages
            }
          case 'DELETED':
            return {
              ...prev,
              messages: prev.messages.filter(message => message._id !== subscriptionData.data.message.payload._id)
            }
          default:
            return prev
        }
      }
    })
    return () => unsubscribe()
  },
  [MsgSub, uid, conv])

  useEffect(() => {
    if (MsgUserRef && search === 1) MsgUserRef()
    if (MsgConvRef && search === 2) MsgConvRef()
  },
  [MsgUserRef, MsgConvRef, keyword, search])

  const sendMessage = (type, body) => {
    if (uid.length && conv.length && body.length)
      createMessage({ variables: { conv, send: uid, type, body } })
  }

  const searchCancel = () => setSearch(0)
  const searchInUser = keyword => {
    if (!keyword.length) { setSearch(0); return }
    setKeyword(keyword)
    setSearch(1)
  }
  const searchInConv = keyword => {
    if (!keyword.length) { setSearch(0); return }
    setKeyword(keyword)
    setSearch(2)
  }

/* 
  // WebSocket
  client.onopen = () => {
    // console.log('onopen', wsready, client, client.readyState)
    if (client.readyState !== 1) return
    const data = [
      'auth',
      {
        user_id: 'alice',
        conv_id: '0',
        credential: 'secret',
      },
    ]
    client.send(JSON.stringify(data))
    setWSReady(true)
  }
  client.onclose = () => {
    // console.log('onclose', wsready, client, client.readyState)
    if (client.readyState !== 1) setWSReady(false)
  }
  client.onmessage = (message) => {
    const { data } = message
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case 'authSuccess': {
        setUID(() => payload.user)
        break
      }
      default:
        break
    }
  }
  useEffect(() => {
    const data = [
      'auth',
      {
        user_id: 'alice',
        conv_id: '0',
        credential: 'secret',
      },
    ]
    // console.log('oneffect', wsready, client, client.readyState, JSON.stringify({data}))
    if (!wsready || client.readyState !== 1) return
    client.send(JSON.stringify({ data }))
    .then(res => {
      console.log('websocket auth', uid)
      // setUID('alice')
    })
  },
  [wsready])
 */

  // Login authorization
  useEffect(() => {
    if (tokenready) return
    instance.get('/auth', { withCredentials: true })
    .then(res => {
      console.log('auth', res.data)
      if (!res.data.uid) {
        setStatus({ type: 'danger', msg: res.data.msg })
        setLogout(true)
      } else {
        setTKready(true)
        setUID(res.data.uid)
        Conversations.refetch()
      }
    })
    .catch(err => {
      setStatus({ type: 'danger', msg: err })
      setLogout(true)
    })
  },
  [uid, tokenready, Conversations])

  // Logout
  const doLogout = e => {
    e.stopPropagation()
    instance.post('/logout', { withCredentials: true })
    .then(res => setStatus({ type: 'success', msg: '成功登出！' }))
    .catch(err => {})
    setLogout(true)
  }

  return {
    tokenready,
    client,
    logout,
    uid,
    status,
    talking: !!uid2.length && !!TalkingToUser.data && TalkingToUser.data.user,
    conversations_ready: !Conversations.loading && !Conversations.error,
    conversations: !!Conversations.data && Conversations.data.conversations,
    messages_ready: (
      search === 2 ? !MessagesInConv.loading && !MessagesInConv.error :
      search === 1 ? !MessagesInUser.loading && !MessagesInUser.error :
      !Messages.loading && !Messages.error
    ),
    messages: (
      search === 2 ? !!MessagesInConv.data && MessagesInConv.data.messagesConv :
      search === 1 ? !!MessagesInUser.data && MessagesInUser.data.messagesUser :
      !!Messages.data && Messages.data.messages
    ),
    search,
    keyword,
    doLogout,
    addUser,
    setConversation,
    sendMessage,
    modifyMessage,
    deleteMessage,
    searchCancel,
    searchInUser,
    searchInConv,
  }
}

export default useChat
