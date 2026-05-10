import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/local")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const expertSchema = new mongoose.Schema({
  name: String,
  category: String,
  experience: Number,
  rating: Number,
  price: Number,
  language: [String],
  about: String,
});
const slotSchema = new mongoose.Schema({
  expert_id: String,
  date: String,
  timeslot: String,
  is_booked: {
    type: Boolean,
    default: false,
  },
});

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

const Expert = mongoose.model("experts", expertSchema);
const Slot = mongoose.model("slots", slotSchema);
const Booking = mongoose.model("bookings", bookingSchema);

app.get("/experts", async (req, res) => {
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
});

app.get("/experts/:id", async (req, res) => {
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
    res.json({ expert, slots });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/booking", async (req, res) => {
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
      return res.status(400).json({ message: "Incomplete Data" });
    }
    const slot = await Slot.findOneAndUpdate(
      { _id: slot_id, is_booked: false },
      { is_booked: true },
      { new: true }
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
});
app.patch("/booking", async (req, res) => {
  try {
    const email = req.query.email;
    const booking = await Booking.findOneAndUpdate({ email }, req.body, {
      new: true,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.get("/categories", async (req, res) => {
  try {
    const categories = await Expert.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/booking", async (req, res) => {
  try {
    const email = req.query.email;
    const bookings = await Booking.find({ email });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

server.listen(3000, () => {
  console.log("Server Running");
});
