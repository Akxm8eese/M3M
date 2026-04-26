import * as waterModel from "../models/waterModel.js";

export const getTodayWater = async (_req, res, next) => {
  try {
    const totalOz = await waterModel.getTodayTotal();
    const entries = await waterModel.getTodayLogs();
    const goal = 64;

    res.json({
      goal,
      total: totalOz,
      progressPercent: Math.min((totalOz / goal) * 100, 100),
      remaining: Math.max(goal - totalOz, 0),
      entries,
    });
  } catch (error) {
    next(error);
  }
};

export const addWater = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Number(amount);

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive integer in ounces." });
    }

    const created = await waterModel.createWaterLog({ amount: parsedAmount });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const deleteWaterLog = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid water log id." });
    }

    const deleted = await waterModel.deleteWaterLogById(id);

    if (!deleted) {
      return res.status(404).json({ error: "Water log not found." });
    }

    return res.json({ message: "Water log deleted successfully." });
  } catch (error) {
    next(error);
  }
};
