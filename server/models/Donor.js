const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 45 // Minimum weight for donation
  },
  height: {
    type: Number,
    required: true
  },
  lastDonation: {
    type: Date
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    isActive: Boolean
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    isActive: Boolean
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  eligibilityNotes: String,
  preferredDonationCenter: String
}, {
  timestamps: true
});

// Calculate age
donorSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Check if donor can donate (minimum 56 days between donations)
donorSchema.methods.canDonate = function() {
  if (!this.lastDonation) return true;
  
  const today = new Date();
  const lastDonation = new Date(this.lastDonation);
  const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
  
  return daysSinceLastDonation >= 56;
};

module.exports = mongoose.model('Donor', donorSchema);
