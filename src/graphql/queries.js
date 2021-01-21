import { gql } from '@apollo/client'

export const USER_QUERY = gql`
query user($uid: String!) {
  user(uid: $uid) {
    uid
    name
    photo
  }
}
`

export const CONVS_QUERY = gql`
query conversations($uid: String!) {
  conversations(uid: $uid) {
    _id
    member_1
    member_2
    recent
  }
}
`

export const MSGS_QUERY = gql`
query messages($conv: String!){
  messages(conv: $conv) {
    _id
    conv
    send
    type
    body
    time
  }
}
`

export const MSGS_IN_USER_CONVS_QUERY = gql`
query messagesUser($uid: String!, $keyword: String!){
  messagesUser(uid:$uid, keyword: $keyword) {
    _id
    conv
    send
    type
    body
    time
  }
}
`

export const MSGS_IN_CONV_QUERY = gql`
query messagesConv($conv: String!, $keyword: String!){
  messagesConv(conv: $conv, keyword: $keyword) {
    _id
    conv
    send
    type
    body
    time
  }
}
`
