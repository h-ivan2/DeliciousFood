const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort("-createdAt");
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    res.status(200).json({ success: true, unreadCount, data: notifications });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: Date.now() },
    );
    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

exports.markOneRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};
