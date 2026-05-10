import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  expert_id: String,
  date: String,
  timeslot: String,
  is_booked: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("slots", slotSchema);