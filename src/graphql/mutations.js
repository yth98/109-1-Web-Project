import { gql } from '@apollo/client'

export const CREATE_CONV_MUT = gql`
mutation createConversation(
  $member1: String!
  $member2: String!
) {
  createConversation(
    data: { member_1: $member1, member_2: $member2 }
  ) {
    member_1
    member_2
    recent
  }
}
`

export const CREATE_MSG_MUT = gql`
mutation createMessage(
  $conv: String!
  $send: String!
  $type: MessageType!
  $body: String!
) {
  createMessage(
    data: {
      conv: $conv
      send: $send
      type: $type
      body: $body
    }
  ) {
    _id
    conv
    send
    type
    body
    time
  }
}
`

export const UPDATE_MSG_MUT = gql`
mutation createMessage(
  $id: String!
  $body: String!
) {
  createMessage(
    _id: $id
    data: { body: $body }
  ) {
    _id
    conv
    send
    type
    body
    time
  }
}
`

export const DELETE_MSG_MUT = gql`
mutation deleteMessage($id: String!) {
  deleteMessage(_id: $id) {
    _id
    conv
    send
    type
    body
    time
  }
}
`
