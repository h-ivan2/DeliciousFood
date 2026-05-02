const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/menu.controller');
const { protect, authorize } = require('../middleware/auth');

// Categories
router.get('/categories/:restaurantId',  ctrl.getCategories);
router.post('/categories',               protect, authorize('owner'), ctrl.createCategory);
router.put('/categories/:id',            protect, authorize('owner'), ctrl.updateCategory);
router.delete('/categories/:id',         protect, authorize('owner'), ctrl.deleteCategory);

// Items
router.get('/items/:restaurantId',       ctrl.getItems);
router.post('/items',                    protect, authorize('owner'), ctrl.createItem);
router.put('/items/:id',                 protect, authorize('owner'), ctrl.updateItem);
router.delete('/items/:id',              protect, authorize('owner'), ctrl.deleteItem);
router.patch('/items/:id/toggle',        protect, authorize('owner'), ctrl.toggleAvailability);

module.exports = router;