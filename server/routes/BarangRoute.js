import express from "express";
import {
  getBarangs,
  getBarangById,
  saveBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barang.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/barangs", getBarangs);
router.get("/barangs/:id", getBarangById);
router.post("/barangs", saveBarang);
router.patch("/barangs/:id", updateBarang);
router.delete("/barangs/:id", deleteBarang);

export default router;
