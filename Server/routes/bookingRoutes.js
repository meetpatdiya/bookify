import express from "express";

import {
  createBooking,
  updateBooking,
  getBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

const bookingRoutes = (io) => {
  router.post("/booking", (req, res) => {
    createBooking(req, res, io);
  });

  router.patch("/booking", updateBooking);

  router.get("/booking", getBookings);

  return router;
};

export default bookingRoutes;