import { Router } from "express";
import { getCollection } from "../mongodb.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const specialities = await getCollection("specialities")
      .find({}, { projection: { name: 1, description: 1, icon: 1, available: 1 } })
      .sort({ name: 1 })
      .toArray();

    res.json(specialities);
  } catch (err) {
    console.error("❌ specialities ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;