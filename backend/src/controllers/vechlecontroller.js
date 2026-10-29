
const Vehicle = require("../models/vehicle");
const Business = require("../models/business");

// Get the logged-in user's business ID
const getBusinessId = async (req) => {
  if (req.business?._id) {
    return req.business._id;
  }

  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return null;
  }

  const business = await Business.findOne({
    user: userId,
  }).select("_id");

  return business?._id || null;
};

// 1. CREATE VEHICLE
exports.createVehicle = async (req, res) => {
  try {
    const { vehicleType, capacity, bodyType, status } = req.body;

    if (!vehicleType || !String(vehicleType).trim()) {
      return res.status(400).json({
        success: false,
        message: "Vehicle type is required",
      });
    }

    const businessId = await getBusinessId(req);

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business profile not found",
      });
    }

    const vehicle = await Vehicle.create({
      business: businessId,
      vehicleType: String(vehicleType).trim(),
      capacity: capacity == null ? "" : String(capacity).trim(),
      bodyType: bodyType == null ? "" : String(bodyType).trim(),
      ...(status ? { status } : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while adding vehicle",
    });
  }
};

// 2. GET MY VEHICLES
exports.getMyVehicles = async (req, res) => {
  try {
    const businessId = await getBusinessId(req);

    if (!businessId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const vehicles = await Vehicle.find({
      business: businessId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching vehicles",
    });
  }
};

// 3. UPDATE VEHICLE
exports.updateVehicle = async (req, res) => {
  try {
    const { vehicleType, capacity, bodyType, status } = req.body;
    const businessId = await getBusinessId(req);

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found",
      });
    }

    const updateData = {};

    if (vehicleType !== undefined) {
      if (!String(vehicleType).trim()) {
        return res.status(400).json({
          success: false,
          message: "Vehicle type cannot be empty",
        });
      }

      updateData.vehicleType = String(vehicleType).trim();
    }

    if (capacity !== undefined) {
      updateData.capacity =
        capacity == null ? "" : String(capacity).trim();
    }

    if (bodyType !== undefined) {
      updateData.bodyType =
        bodyType == null ? "" : String(bodyType).trim();
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        business: businessId,
      },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating vehicle",
    });
  }
};

// 4. DELETE VEHICLE
exports.deleteVehicle = async (req, res) => {
  try {
    const businessId = await getBusinessId(req);

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found",
      });
    }

    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      business: businessId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting vehicle",
    });
  }
};

// 5. GET MY WORKING AREAS
exports.getMyWorkingAreas = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const business = await Business.findOne({
      user: userId,
    }).select("workingAreas");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Working areas fetched successfully",
      data: business.workingAreas || [],
    });
  } catch (error) {
    console.error("Get working areas error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// 6. DELETE WORKING AREA
exports.deleteWorkingArea = async (req, res) => {
  try {
    const { areaId, state } = req.body;

    if (!areaId && !state) {
      return res.status(400).json({
        success: false,
        message: "Please provide either areaId or state",
      });
    }

    const userId = req.user?.id || req.user?._id;

    const pullCondition = areaId
      ? { _id: areaId }
      : { state };

    const business = await Business.findOneAndUpdate(
      { user: userId },
      { $pull: { workingAreas: pullCondition } },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Working area removed successfully",
      data: business.workingAreas || [],
    });
  } catch (error) {
    console.error("Delete working area error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
