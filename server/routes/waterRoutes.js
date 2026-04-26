const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/waterController');

router.get('/today', ctrl.getToday);
router.post('/', ctrl.addWater);
router.delete('/:id', ctrl.deleteWater);

module.exports = router;
