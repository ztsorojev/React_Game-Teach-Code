const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChallengeSchema = new Schema({
	challenge: {type: Number, required: true},
	action: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Action'
		}
	]
});


module.exports = mongoose.model('Challenge', ChallengeSchema);