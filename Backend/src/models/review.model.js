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


reviewSchema.statics.calculateAverageRating = async function (restaurantId) {
  const Restaurant = require('./restaurant.model');
  const stats = await this.aggregate([
    { $match: { restaurant: restaurantId } },
    { $group: { _id: '$restaurant', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating:      0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.restaurant);
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calculateAverageRating(this.restaurant);
});

module.exports = mongoose.model('Review', reviewSchema);