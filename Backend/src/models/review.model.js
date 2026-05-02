const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Order',
  },
  rating: {
    type:     Number,
    required: true,
    min:      1,
    max:      5,
  },
  comment: {
    type:      String,
    maxlength: 1000,
  },
  ownerReply: {
    comment:   String,
    repliedAt: Date,
  },
}, { timestamps: true });


reviewSchema.index({ customer: 1, restaurant: 1 }, { unique: true });


reviewSchema.post('save', async function () {
  const Restaurant = require('./restaurant.model');
  const stats = await this.constructor.aggregate([
    { $match: { restaurant: this.restaurant } },
    { $group: { _id: '$restaurant', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(this.restaurant, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);