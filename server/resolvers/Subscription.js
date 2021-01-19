const Subscription = {
  conversation: {
    subscribe(parent, { uid }, { pubsub }, info) {
      return pubsub.asyncIterator(`conv-${uid}`)
    }
  },
  message: {
    subscribe(parent, { uid }, { pubsub }, info) {
      return pubsub.asyncIterator(`message-${uid}`)
    }
  },
}

module.exports = Subscription
