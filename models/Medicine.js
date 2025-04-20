
const mongoose = require('mongoose');
const moment = require('moment');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['antibiotics', 'analgesics', 'antiviral', 'vitamins', 'vaccines', 'antihistamines', 'other']
  },
  barcode: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Virtual property for expiry status
MedicineSchema.virtual('expiryStatus').get(function() {
  const today = moment();
  const expiryDate = moment(this.expiryDate);
  const daysUntilExpiry = expiryDate.diff(today, 'days');

  if (daysUntilExpiry < 0) {
    return 'expired'; // Already expired
  } else if (daysUntilExpiry <= 30) {
    return 'expiring-soon'; // Expiring within 30 days
  } else {
    return 'safe'; // Safe, more than 30 days until expiry
  }
});

// Enable virtuals in JSON
MedicineSchema.set('toJSON', { virtuals: true });
MedicineSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
