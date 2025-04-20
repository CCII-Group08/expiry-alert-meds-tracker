
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const moment = require('moment');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicines by expiry status
router.get('/status/:status', async (req, res) => {
  try {
    const today = new Date();
    let query = {};
    
    switch(req.params.status) {
      case 'expired':
        query = { expiryDate: { $lt: today } };
        break;
      case 'expiring-soon':
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        query = { 
          expiryDate: { 
            $gte: today,
            $lte: thirtyDaysFromNow 
          } 
        };
        break;
      case 'safe':
        const thirtyDays = new Date();
        thirtyDays.setDate(today.getDate() + 30);
        query = { expiryDate: { $gt: thirtyDays } };
        break;
      default:
        return res.status(400).json({ message: 'Invalid status parameter' });
    }
    
    const medicines = await Medicine.find(query).sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicines by category
router.get('/category/:category', async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category }).sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new medicine
router.post('/', async (req, res) => {
  const medicine = new Medicine({
    name: req.body.name,
    quantity: req.body.quantity,
    batchNumber: req.body.batchNumber,
    expiryDate: req.body.expiryDate,
    manufacturer: req.body.manufacturer,
    category: req.body.category,
    barcode: req.body.barcode,
    notes: req.body.notes
  });

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update medicine
router.put('/:id', async (req, res) => {
  try {
    // Add lastUpdated timestamp
    req.body.lastUpdated = new Date();
    
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated doc
    );
    
    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(updatedMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET medicine by barcode
router.get('/barcode/:code', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ barcode: req.params.code });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found with this barcode' });
    }
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
