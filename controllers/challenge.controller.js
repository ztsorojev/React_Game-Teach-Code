const Action = require('../models/action.model');

exports.action_details = function(req, res) {
	//res.send('Hello test from challenge controller');
	let challengeid = parseInt(req.params.id);
	let actionid = parseInt(req.params.actid);
	let query = { "challengeid": challengeid, "actionid": actionid };
	Action.findOne(query, function (err, action) {
        if (err) return next(err);
        res.send(action);
    });
}

exports.action_test = function(req, res) {
	let args = req.body.args;
	let code = req.body.userCode;
	let fun = new Function(args, code);

	let challengeid = parseInt(req.params.id);
	let actionid = parseInt(req.params.actid);
	let query = { "challengeid": challengeid, "actionid": actionid };

	Action.findOne(query, function (err, action) {
        if (err) return next(err);
        res.send(fun() == action.test);
    });
}

exports.challenge_create = function (req, res) {
    let action = new Action(
		{
		    "actionid": 1,
		    "challengeid": 1,
		    "description": "A message intended for the governor of the castle has been intercepted by one of your spies! Breaking the code could reveal important information about weaknesses in the castle's defense!",
		    "instructions": "The encrypted message has been saved into an array called 'message_array'. Your best cryptogrophers have writena function that they think will crack the code. Complete the for loop to iterate over the entire length of message_array to finish the decryption.",
		    "code": "var message = \"Riefnroecemtn sow'n trairevf roa onhtre3 w eesk .oYrug rairos nfo3 00t orpo siwllh va eotl sa tnuit lhtne.\"; var message_array = Array.from(message); var temp;",
		    "test": "Reinforcements won't arrive for another 3 weeks. Your garrison of 300 troops will have to last until then."
		}
    );

    action.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Action created successfully')
    })
};