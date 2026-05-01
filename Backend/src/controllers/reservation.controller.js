const Reservation = require('../models/reservation.model');
const Restaurant  = require('../models/restaurant.model');

exports.createReservation = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant || restaurant.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    const reservation = await Reservation.create({ ...req.body, customer: req.user._id });
    res.status(201).json({ success: true, data: reservation });
  } catch (err) { next(err); }
};

exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ customer: req.user._id })
      .populate('restaurant', 'name address')
      .sort('-date');
    res.status(200).json({ success: true, data: reservations });
  } catch (err) { next(err); }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('restaurant');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    if (reservation.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }
    reservation.status = req.body.status;
    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (err) { next(err); }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    if (reservation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }
    if (['cancelled', 'completed'].includes(reservation.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this reservation' });
    }
    reservation.status = 'cancelled';
    await reservation.save();
    res.status(200).json({ success: true, message: 'Reservation cancelled' });
  } catch (err) { next(err); }
};