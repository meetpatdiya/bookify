import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  name: String,
  category: String,
  experience: Number,
  rating: Number,
  price: Number,
  language: [String],
  about: String,
});

export default mongoose.model("experts", expertSchema);