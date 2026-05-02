// src/routes/restaurant.routes.js
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant registration and discovery
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: List all approved restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated restaurant list
 */
router.get('/', ctrl.getRestaurants);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Register a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Al Basha Grill
 *               address:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city:   { type: string }
 *               cuisine:
 *                 type: array
 *                 items: { type: string }
 *                 example: [Lebanese, Mediterranean]
 *     responses:
 *       201:
 *         description: Restaurant submitted for approval
 *       401:
 *         description: Not logged in
 */
router.post('/', protect, authorize('owner'), ctrl.createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a single restaurant with its full menu
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant details and menu
 *       404:
 *         description: Not found
 */
router.get('/:id', ctrl.getRestaurant);
router.get('/my',        protect, authorize('owner'), ctrl.getMyRestaurants);
router.put('/:id',       protect, authorize('owner', 'admin'), ctrl.updateRestaurant);
router.delete('/:id',    protect, authorize('owner', 'admin'), ctrl.deleteRestaurant);
router.patch('/:id/toggle', protect, authorize('owner'), ctrl.toggleOpen);

module.exports = router;