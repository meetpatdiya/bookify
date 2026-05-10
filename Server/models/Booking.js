import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  expert_id: String,
  slot_id: String,
  name: String,
  email: String,
  phone: String,
  date: String,
  timeslot: String,
  notes: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending",
  },
});

export default mongoose.model("bookings", bookingSchema);