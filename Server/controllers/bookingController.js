import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";

export const createBooking = async (req, res, io) => {
  try {
    const { expert_id, slot_id, name, email, phone, date, timeslot, notes } =
      req.body;

    if (
      !expert_id ||
      !slot_id ||
      !name ||
      !email ||
      !phone ||
      !date ||
      !timeslot ||
      !notes
    ) {
      console.log("hello")
      return res.status(400).json({
        message: "Incomplete Data",
      });
    }

    const slot = await Slot.findOneAndUpdate(
      { _id: slot_id, is_booked: false },
      { is_booked: true },
      { returnDocument: "after" }
    );

    if (!slot) {
      return res.status(400).json({
        message: "Slot already booked or not found",
      });
    }

    const booking = await Booking.create({
      expert_id,
      slot_id,
      name,
      email,
      phone,
      date,
      timeslot,
      notes,
    });

    io.emit("slot_updated", {
      slot_id,
      expert_id,
      date,
      timeslot,
      is_booked: true,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const email = req.query.email;

    const booking = await Booking.findOneAndUpdate(
      { email },
      req.body,
      { returnDocument: "after" }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const email = req.query.email;

    const bookings = await Booking.find({ email });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};