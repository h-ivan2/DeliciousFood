const Review = require("../models/review.model");
const Order = require("../models/order.model");
const Restaurant = require("../models/restaurant.model");

exports.createReview = async (req, res, next) => {
  try {
    const existing = await Review.findOne({
      customer: req.user._id,
      restaurant: req.body.restaurant,
    });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already reviewed this restaurant",
        });
    }
    const review = await Review.create({ ...req.body, customer: req.user._id });
    await review.populate("customer", "name avatar");
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate("customer", "name avatar")
      .sort("-createdAt");
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.replyToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate("restaurant");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    if (review.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    review.ownerReply = { comment: req.body.comment, repliedAt: Date.now() };
    await review.save();
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    const isAuthor = review.customer.toString() === req.user._id.toString();
    if (!isAuthor && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
