const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const MessageSchema = new Schema({
	conv: {
		type: ObjectID,
		required: true
	},
	send: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: [true, 'Type is required.']
	},
	body: {
		type: String,
		required: [true, 'Body field is required.']
	},
	time: {
		type: Date,
		required: true
	},
})

// Creating a table within database with the defined schema
const Message = mongoose.model('message', MessageSchema)

// Exporting table for querying and mutating
module.exports = Message
