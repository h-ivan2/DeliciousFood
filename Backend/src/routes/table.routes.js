const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/table.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/available/:restaurantId', ctrl.getAvailableTables);
router.get('/restaurant/:restaurantId', protect, authorize('owner', 'admin'), ctrl.getTables);
router.post('/', protect, authorize('owner'), ctrl.createTable);
router.put('/:id', protect, authorize('owner'), ctrl.updateTable);
router.delete('/:id', protect, authorize('owner'), ctrl.deleteTable);

module.exports = router;
