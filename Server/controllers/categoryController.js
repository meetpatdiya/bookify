import Expert from "../models/Expert.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Expert.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};