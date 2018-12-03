const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ActionSchema = new Schema({
	actionid: Number,
	challengeid: Number,
	description: String,
	instructions: String,
	code: String,
	test: String
});


module.exports = mongoose.model('Action', ActionSchema);