import express from "express";

import {
  getExperts,
  getSingleExpert,
} from "../controllers/expertController.js";

const router = express.Router();

router.get("/experts", getExperts);

router.get("/experts/:id", getSingleExpert);

export default router;