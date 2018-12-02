const express = require('express');
const router = express.Router();

const challenge_controller = require('../controllers/challenge.controler');


router.get('/test', challenge_controller.test);


module.exports = router;