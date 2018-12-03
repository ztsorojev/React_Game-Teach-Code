const express = require('express');
const bodyParser = require('body-parser');
const challengeRouter = require('./routes/challenge.route');
const app = express();
const port = process.env.PORT || 5000;

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://user1:edufun7@ds141932.mlab.com:41932/educationgamehci';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/challenge', challengeRouter);

/*
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
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));