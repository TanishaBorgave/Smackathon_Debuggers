const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true,
    min: 0
  },
  maxUnits: {
    type: Number,
    required: true,
    min: 0
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    name: String,
    address: String,
    city: String,
    state: String
  },
  expirationDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'expired', 'used'],
    default: 'available'
  },
  source: {
    type: String,
    enum: ['donation', 'purchase', 'transfer'],
    default: 'donation'
  },
  notes: String
}, {
  timestamps: true
});

// Calculate days until expiration
bloodStockSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.expirationDate) return null;
  const today = new Date();
  const expiration = new Date(this.expirationDate);
  const diffTime = expiration - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Calculate urgency level
bloodStockSchema.virtual('urgency').get(function() {
  const daysLeft = this.daysUntilExpiration;
  if (daysLeft <= 7) return 'high';
  if (daysLeft <= 14) return 'medium';
  return 'low';
});

// Check if blood is expired
bloodStockSchema.virtual('isExpired').get(function() {
  if (!this.expirationDate) return false;
  return new Date() > this.expirationDate;
});

// Update status based on expiration
bloodStockSchema.methods.updateStatus = function() {
  if (this.isExpired && this.status === 'available') {
    this.status = 'expired';
  }
  return this.save();
};

module.exports = mongoose.model('BloodStock', bloodStockSchema);
