const Table = require("../models/table.model");
const Restaurant = require("../models/restaurant.model");
const Reservation = require("../models/reservation.model");

// @desc    Create a new table
// @route   POST /api/v1/tables
// @access  Private (owner)
exports.createTable = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorised to add tables to this restaurant",
        });
    }

    const table = await Table.create(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (err) {
    // Handle mongoose unique constraint violation
    if (err.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Table number already exists for this restaurant",
        });
    }
    next(err);
  }
};

// @desc    Get all tables for a restaurant (for owners to manage)
// @route   GET /api/v1/tables/restaurant/:restaurantId
// @access  Private (owner)
exports.getTables = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
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

    const tables = await Table.find({
      restaurant: req.params.restaurantId,
    }).sort("tableNumber");
    res.status(200).json({ success: true, count: tables.length, data: tables });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a table
// @route   PUT /api/v1/tables/:id
// @access  Private (owner)
exports.updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate("restaurant");
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    if (table.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Table number already exists for this restaurant",
        });
    }
    next(err);
  }
};

// @desc    Delete a table
// @route   DELETE /api/v1/tables/:id
// @access  Private (owner)
exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate("restaurant");
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    if (table.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    await table.deleteOne();
    res.status(200).json({ success: true, message: "Table deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get available tables for a given restaurant, date, time and partySize
// @route   GET /api/v1/tables/available/:restaurantId
// @access  Public
exports.getAvailableTables = async (req, res, next) => {
  try {
    const { date, time, partySize } = req.query;

    if (!date || !time || !partySize) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide date, time, and partySize",
        });
    }

    // Convert requested time to a Date object to create a 2-hour window
    const requestedDateTime = new Date(`${date}T${time}`);
    const twoHoursBefore = new Date(
      requestedDateTime.getTime() - 2 * 60 * 60 * 1000,
    );
    const twoHoursAfter = new Date(
      requestedDateTime.getTime() + 2 * 60 * 60 * 1000,
    );

    // Find overlapping reservations that are not cancelled or completed
    const overlappingReservations = await Reservation.find({
      restaurant: req.params.restaurantId,
      status: { $in: ["pending", "confirmed"] },
      $expr: {
        $and: [
          // Extract time and date logic simply by comparing actual Date objects
          // created dynamically from stored date + time
          {
            $gt: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$time",
                    ],
                  },
                },
              },
              twoHoursBefore,
            ],
          },
          {
            $lt: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$time",
                    ],
                  },
                },
              },
              twoHoursAfter,
            ],
          },
        ],
      },
    });

    // Get IDs of tables that are booked
    const bookedTableIds = overlappingReservations.map((res) =>
      res.table.toString(),
    );

    // Find active tables that have enough capacity and are NOT in the bookedTableIds
    const availableTables = await Table.find({
      restaurant: req.params.restaurantId,
      isActive: true,
      capacity: { $gte: Number(partySize) },
      _id: { $nin: bookedTableIds },
    }).sort("capacity");

    res
      .status(200)
      .json({
        success: true,
        count: availableTables.length,
        data: availableTables,
      });
  } catch (err) {
    next(err);
  }
};
