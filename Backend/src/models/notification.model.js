const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'order_placed', 'order_confirmed', 'order_preparing',
      'order_ready', 'order_delivered', 'order_cancelled',
      'reservation_confirmed', 'reservation_cancelled',
      'restaurant_approved', 'restaurant_rejected', 'new_review',
    ],
    required: true,
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  data:    { type: mongoose.Schema.Types.Mixed },
  isRead:  { type: Boolean, default: false },
  readAt:  Date,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);