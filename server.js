const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/challenge/:step', (req, res) => {
	let instructions = "Reinforcements won't arrive for another 3 weeks. Your garrison of 300 troops will have to last until then.";
	res.send({ instructions: instructions });
});

app.post('/api/test/:step', (req, res) => {
	console.log(req.body.args);
	console.log(req.body.userCode);
	let args = req.body.args;
	let code = req.body.userCode;
	let fun = new Function(args, code);

	//test case
	let isWorking = (fun(1,2) === 3);

	res.send(isWorking);
});

app.listen(port, () => console.log(`Listening on port ${port}`));