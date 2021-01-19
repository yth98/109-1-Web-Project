const bcrypt = require('bcrypt')
const { now } = require('mongoose')

const Mutation = {
  async createUser(parent, { data }, { User }, info) {
    return await User.create({...data, password_hash: await bcrypt.hash(data.pass, 10)})
  },
  async createConversation(parent, { data }, { User, Conv, pubsub }, info) {
    if (data.member_1 === data.member_2) throw new Error("Two members cannot be the same.")
    if (data.member_1 > data.member_2) [data.member_1, data.member_2] = [data.member_2, data.member_1]
    if (await Conv.findOne(data)) throw new Error("The conversation already exists.")
    if (!await User.findOne({uid: data.member_1}) || !await User.findOne({uid: data.member_2}))
      throw new Error("The specified user does not exist.")
    const conv = await Conv.create({...data, recent: now()})
    pubsub.publish(`conv-${conv.member_1}`, {conversation: {mutation: 'CREATED', payload: conv}})
    pubsub.publish(`conv-${conv.member_2}`, {conversation: {mutation: 'CREATED', payload: conv}})
    return conv
  },
  async deleteConversation(parent, { _id }, { Conv, Message, pubsub }, info) {
    const conv = await Conv.findOneAndDelete({_id})
    if (!conv) throw new Error("Invalid conversation ID.")
    await Message.deleteMany({conv: conv._id})
    pubsub.publish(`conv-${conv.member_1}`, {conversation: {mutation: 'DELETED', payload: conv}})
    pubsub.publish(`conv-${conv.member_2}`, {conversation: {mutation: 'DELETED', payload: conv}})
    return conv
  },
  async createMessage(parent, { data }, { Conv, Message, pubsub }, info) {
    const conv = await Conv.findOne({_id: data.conv, $or: [{member_1: data.send}, {member_2: data.send}]})
    if (!conv) throw new Error("The conversation does not exist, or Sender is not in the conversation.")
    const msg = await Message.create({...data, time: now()})
    await Conv.updateOne({_id: data.conv}, {recent: msg.time})
    pubsub.publish(`message-${conv.member_1}`, {message: {mutation: 'CREATED', payload: msg}})
    pubsub.publish(`message-${conv.member_2}`, {message: {mutation: 'CREATED', payload: msg}})
    pubsub.publish(`conv-${conv.member_1}`, {conversation: {mutation: 'UPDATED', payload: conv}})
    pubsub.publish(`conv-${conv.member_2}`, {conversation: {mutation: 'UPDATED', payload: conv}})
    return msg
  },
  async deleteMessage(parent, { _id }, { Conv, Message, pubsub }, info) {
    const msg = await Message.findOneAndDelete({_id})
    if (!msg) throw new Error("Invalid message ID.")
    const conv = await Conv.findOne({_id: msg.conv})
    pubsub.publish(`message-${conv.member_1}`, {message: {mutation: 'DELETED', payload: msg}})
    pubsub.publish(`message-${conv.member_2}`, {message: {mutation: 'DELETED', payload: msg}})
    return msg
  },
  async updateMessage(parent, { _id, data }, { Conv, Message, pubsub }, info) {
    const msg = await Message.findByIdAndUpdate(_id, {...data, time: now()}, {new: true})
    if (!msg) throw new Error("Invalid message ID.")
    const conv = await Conv.findByIdAndUpdate(msg.conv, {recent: msg.time}, {new: true})
    pubsub.publish(`message-${conv.member_1}`, {message: {mutation: 'UPDATED', payload: msg}})
    pubsub.publish(`message-${conv.member_2}`, {message: {mutation: 'UPDATED', payload: msg}})
    return msg
  },
}

module.exports = Mutation
