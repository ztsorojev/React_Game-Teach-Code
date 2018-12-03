const express = require('express');
const router = express.Router();

const challenge_controller = require('../controllers/challenge.controller');


router.get('/:id/action/:actid', challenge_controller.action_details);

router.post('/create', challenge_controller.challenge_create);

router.post('/:id/actiontest/:actid', challenge_controller.action_test);

module.exports = router;