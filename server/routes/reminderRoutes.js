const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reminderController');

router.get('/', ctrl.getReminders);
router.post('/', ctrl.createReminder);
router.put('/:id', ctrl.updateReminder);
router.delete('/:id', ctrl.deleteReminder);

module.exports = router;
