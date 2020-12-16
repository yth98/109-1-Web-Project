const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const UserSchema = new Schema({
	user_id: {
		type: String,
		required: [true, 'User ID is required.']
	},
	password_hash: {
		type: String,
		required: true
	},
	password_salt: {
		type: String,
		required: true
	},
	user_name: {
		type: String,
		required: [true, 'Body field is required.']
	},
	user_photo: { type: String }
})

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema)

// Exporting table for querying and mutating
module.exports = User
