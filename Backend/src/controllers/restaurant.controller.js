const Restaurant = require("../models/restaurant.model");

// @desc    Get all approved restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = async (req, res, next) => {
  try {
    const { search, city, cuisine, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const filter = { status: "approved" };

    if (search) filter.$text = { $search: search };
    if (city) filter["address.city"] = new RegExp(city, "i");
    if (cuisine) filter.cuisine = { $in: cuisine.split(",") };

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).skip(skip).limit(Number(limit)).sort("-rating"),
      Restaurant.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      pages: Math.ceil(total / limit),
      data: restaurants,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single restaurant
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email",
    );
    if (!restaurant || restaurant.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc    Create restaurant
// @route   POST /api/v1/restaurants
// @access  Private (owner)
exports.createRestaurant = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files.logo) {
        req.body.logo = {
          public_id: req.files.logo[0].filename,
          url: req.files.logo[0].path,
        };
      }
      if (req.files.coverImage) {
        req.body.coverImage = {
          public_id: req.files.coverImage[0].filename,
          url: req.files.coverImage[0].path,
        };
      }
    }

    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private (owner)
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    // Owners cannot change their own status — only admins can
    if (req.user.role !== "admin") delete req.body.status;

    if (req.files) {
      if (req.files.logo) {
        req.body.logo = {
          public_id: req.files.logo[0].filename,
          url: req.files.logo[0].path,
        };
      }
      if (req.files.coverImage) {
        req.body.coverImage = {
          public_id: req.files.coverImage[0].filename,
          url: req.files.coverImage[0].path,
        };
      }
    }

    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private (owner, admin)
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    await restaurant.deleteOne();
    res.status(200).json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my restaurants (owner)
// @route   GET /api/v1/restaurants/my
// @access  Private (owner)
exports.getMyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res
      .status(200)
      .json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle open/closed
// @route   PATCH /api/v1/restaurants/:id/toggle
// @access  Private (owner)
exports.toggleOpen = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    if (restaurant.status !== "approved") {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant must be approved first" });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, isOpen: restaurant.isOpen });
  } catch (err) {
    next(err);
  }
};
