const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  restaurant: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Restaurant',
    required: true,
  },
  date:      { type: Date,   required: true },
  time:      { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests:  String,
  confirmationCode: String,
}, { timestamps: true });

reservationSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode = `RES-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);