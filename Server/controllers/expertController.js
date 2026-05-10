import Expert from "../models/Expert.js";
import Slot from "../models/Slot.js";

export const getExperts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;

  let filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: "i" };
  }

  try {
    const experts = await Expert.find(filter).skip(skip).limit(limit);

    const total = await Expert.countDocuments(filter);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalExperts: total,
      experts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSingleExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        message: "Expert not found",
      });
    }

    const slots = await Slot.find({
      expert_id: req.params.id,
    });

    res.json({
      expert,
      slots,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};