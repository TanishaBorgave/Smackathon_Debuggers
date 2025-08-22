const express = require('express');
const Donor = require('../models/Donor');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get all donors (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const donors = await Donor.find()
      .populate('userId', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// Get donor by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findById(id)
      .populate('userId', 'name email phone address');

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Check if user has permission to view this donor
    if (req.user.role !== 'admin' && donor.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ message: 'Error fetching donor' });
  }
});

// Get current user's donor profile
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.userId })
      .populate('userId', 'name email phone address');

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    res.status(500).json({ message: 'Error fetching donor profile' });
  }
});

// Update donor profile
router.put('/profile/me', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated by donor
    delete updates.userId;
    delete updates.isEligible;
    delete updates.eligibilityNotes;

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error updating donor profile:', error);
    res.status(500).json({ message: 'Error updating donor profile' });
  }
});

// Update donor eligibility (admin only)
router.patch('/:id/eligibility', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { isEligible, eligibilityNotes } = req.body;

    const donor = await Donor.findByIdAndUpdate(
      id,
      { isEligible, eligibilityNotes },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error updating donor eligibility:', error);
    res.status(500).json({ message: 'Error updating donor eligibility' });
  }
});

// Get donors by blood type
router.get('/blood-type/:bloodType', async (req, res) => {
  try {
    const { bloodType } = req.params;
    const donors = await Donor.find({ 
      bloodType, 
      isEligible: true 
    })
    .populate('userId', 'name city state')
    .select('bloodType lastDonation preferredDonationCenter');

    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors by blood type:', error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// Get eligible donors for donation
router.get('/eligible/donation', async (req, res) => {
  try {
    const eligibleDonors = await Donor.find({ isEligible: true })
      .populate('userId', 'name city state')
      .select('bloodType lastDonation preferredDonationCenter');

    // Filter donors who can donate (56+ days since last donation)
    const availableDonors = eligibleDonors.filter(donor => donor.canDonate());

    res.json(availableDonors);
  } catch (error) {
    console.error('Error fetching eligible donors:', error);
    res.status(500).json({ message: 'Error fetching eligible donors' });
  }
});

// Record blood donation
router.post('/:id/donation', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { units, donationCenter, notes } = req.body;

    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Check if donor is eligible
    if (!donor.isEligible) {
      return res.status(400).json({ message: 'Donor is not eligible for donation' });
    }

    // Check if donor can donate
    if (!donor.canDonate()) {
      return res.status(400).json({ message: 'Donor cannot donate yet (56-day rule)' });
    }

    // Update last donation date
    donor.lastDonation = new Date();
    await donor.save();

    res.json({
      message: 'Donation recorded successfully',
      donor,
      nextEligibleDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({ message: 'Error recording donation' });
  }
});

// Get donor statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const stats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodType',
          count: { $sum: 1 },
          eligibleCount: {
            $sum: { $cond: ['$isEligible', 1, 0] }
          },
          avgAge: { $avg: { $year: { $dateDiff: { startDate: '$dateOfBirth', endDate: '$$NOW', unit: 'year' } } } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalDonors = await Donor.countDocuments();
    const eligibleDonors = await Donor.countDocuments({ isEligible: true });

    res.json({
      totalDonors,
      eligibleDonors,
      byBloodType: stats
    });
  } catch (error) {
    console.error('Error fetching donor statistics:', error);
    res.status(500).json({ message: 'Error fetching donor statistics' });
  }
});

// Search donors
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { query } = req.params;
    const donors = await Donor.find({
      $or: [
        { 'userId.name': { $regex: query, $options: 'i' } },
        { 'userId.email': { $regex: query, $options: 'i' } },
        { bloodType: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('userId', 'name email phone city state')
    .limit(20);

    res.json(donors);
  } catch (error) {
    console.error('Error searching donors:', error);
    res.status(500).json({ message: 'Error searching donors' });
  }
});

module.exports = router;
