const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ActionSchema = new Schema({
	id: Number,
	description: String,
	code: String,
	test: String
});


module.exports = mongoose.model('Action', ActionSchema);