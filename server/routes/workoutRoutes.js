const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/workoutController');

router.get('/', ctrl.getWorkouts);
router.post('/', ctrl.createWorkout);
router.delete('/:id', ctrl.deleteWorkout);

module.exports = router;
