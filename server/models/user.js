const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const UserSchema = new Schema({
	uid: {
		type: String,
		required: [true, 'User ID is required.'],
		unique: true
	},
	password_hash: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: [true, 'User name is required.']
	},
	photo: { type: String },
})

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema)

// Exporting table for querying and mutating
module.exports = User
