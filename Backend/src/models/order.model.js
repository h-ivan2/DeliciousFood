const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem:  { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  subtotal:  { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type:   String,
    unique: true,
  },
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
  items: [orderItemSchema],
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderType: {
    type:     String,
    enum:     ['delivery', 'pickup', 'dine_in'],
    required: true,
  },
  deliveryAddress: {
    street:  String,
    city:    String,
    state:   String,
    zipCode: String,
  },
  subtotal:    { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tax:         { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet'],
  },
  paymentStatus: {
    type:    String,
    enum:    ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  specialInstructions: String,
  cancelReason:        String,
}, { timestamps: true });

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random    = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `DF-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);