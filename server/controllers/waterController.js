const WaterModel = require('../models/waterModel');

exports.getToday = async (req, res, next) => {
  try {
    const logs = await WaterModel.getToday();
    const total = logs.reduce((sum, l) => sum + parseFloat(l.amount), 0);
    res.json({ logs, total });
  } catch (err) {
    next(err);
  }
};

exports.addWater = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Amount is required.' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number (oz).' });
    }

    const log = await WaterModel.create({ amount });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

exports.deleteWater = async (req, res, next) => {
  try {
    const deleted = await WaterModel.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Water log not found.' });
    }
    res.json({ message: 'Water log deleted.' });
  } catch (err) {
    next(err);
  }
};
