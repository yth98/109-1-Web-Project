import { gql } from '@apollo/client'

export const CONV_SUB = gql`
subscription conversation($uid: String!) {
  conversation(uid: $uid) {
    mutation
    payload {
      _id
      member_1
      member_2
      recent
    }
  }
}
`

export const MSG_SUB = gql`
subscription message($uid: String!) {
  message(uid: $uid) {
    mutation
    payload {
      _id
      conv
      send
      type
      body
      time
    }
  }
}
`
