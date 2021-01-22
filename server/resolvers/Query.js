const Query = {
  async user(parent, args, { User }, info) {
    return await User.findOne({uid: args.uid})
  },
  async conversations(parent, args, { Conv }, info) {
    return await Conv.find({$or: [{member_1: args.uid}, {member_2: args.uid}]}).sort({recent: -1}).exec()
  },
  async messages(parent, args, { Conv, Message }, info) {
    return await Message.find(args)
  },
  async messagesUser(parent, args, { Message }, info) {
    const regexp = args.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return await Message.aggregate([
        {$match: {body: {$regex: regexp, $options: "i"}}},
        {$lookup: {from: "conversations", localField: "ObjectId(conv)", foreignField: "ObjectId(_id)", as: "convs"}},
        {$match: {$or: [{"convs.member_1": args.uid}, {"convs.member_2": args.uid}]}},
      ]).exec()
  },
  async messagesConv(parent, args, { Message }, info) {
    const regexp = args.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return await Message.find({$and: [{conv: args.conv}, {body: {$regex: regexp, $options: "i"}}]})
  },
}

module.exports = Query
