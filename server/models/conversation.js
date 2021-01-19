const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ConversationSchema = new Schema({
	member_1: {
		type: String,
		required: true
	},
	member_2: {
		type: String,
		required: true
	},
	recent: {
		type: Date,
		required: true
	},
})

// Creating a table within database with the defined schema
const Conversation = mongoose.model('conversation', ConversationSchema)

// Exporting table for querying and mutating
module.exports = Conversation
