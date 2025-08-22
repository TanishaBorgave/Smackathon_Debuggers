const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true,
    min: 1
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  hospital: {
    name: String,
    address: String,
    city: String,
    state: String
  },
  doctor: {
    name: String,
    phone: String,
    email: String
  },
  reason: {
    type: String,
    required: true
  },
  requiredBy: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'fulfilled', 'cancelled', 'rejected'],
    default: 'pending'
  },
  notes: String,
  fulfilledBy: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor'
    },
    units: Number,
    date: Date
  }],
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate priority based on urgency and required date
bloodRequestSchema.methods.calculatePriority = function() {
  let priority = 0;
  
  // Urgency weight
  switch (this.urgency) {
    case 'emergency':
      priority += 100;
      break;
    case 'high':
      priority += 75;
      break;
    case 'medium':
      priority += 50;
      break;
    case 'low':
      priority += 25;
      break;
  }
  
  // Time urgency (days until required)
  const daysUntilRequired = Math.ceil((new Date(this.requiredBy) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysUntilRequired <= 1) priority += 50;
  else if (daysUntilRequired <= 3) priority += 30;
  else if (daysUntilRequired <= 7) priority += 15;
  
  this.priority = priority;
  return priority;
};

// Check if request is urgent
bloodRequestSchema.virtual('isUrgent').get(function() {
  return this.urgency === 'emergency' || this.urgency === 'high';
});

// Check if request is overdue
bloodRequestSchema.virtual('isOverdue').get(function() {
  return new Date() > new Date(this.requiredBy) && this.status !== 'fulfilled';
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
