const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurant: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Restaurant',
    required: true,
  },
  tableNumber: {
    type:     String,
    required: true,
    trim:     true,
  },
  capacity: {
    type:     Number,
    required: true,
    min:      1,
  },
  location: {
    type:     String,
    enum:     ['Indoor', 'Patio', 'Window', 'Bar', 'Other'],
    default:  'Indoor',
  },
  isActive: {
    type:     Boolean,
    default:  true,
  }
}, { timestamps: true });

// Ensure table numbers are unique per restaurant
tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
