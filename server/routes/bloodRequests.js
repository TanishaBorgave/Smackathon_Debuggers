const express = require('express');
const BloodRequest = require('../models/BloodRequest');
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

// Get all blood requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, only show their own requests
    if (req.user.role !== 'admin') {
      query.requester = req.user.userId;
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ message: 'Error fetching blood requests' });
  }
});

// Get blood request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BloodRequest.findById(id)
      .populate('requester', 'name email phone')
      .populate('fulfilledBy.donor', 'bloodType');

    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // Check if user has permission to view this request
    if (req.user.role !== 'admin' && request.requester.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching blood request:', error);
    res.status(500).json({ message: 'Error fetching blood request' });
  }
});

// Create new blood request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientName,
      bloodType,
      units,
      urgency,
      hospital,
      doctor,
      reason,
      requiredBy,
      notes
    } = req.body;

    const newRequest = new BloodRequest({
      requester: req.user.userId,
      patientName,
      bloodType,
      units,
      urgency,
      hospital,
      doctor,
      reason,
      requiredBy,
      notes
    });

    // Calculate priority
    newRequest.calculatePriority();

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ message: 'Error creating blood request' });
  }
});

// Update blood request
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // Check if user has permission to update this request
    if (req.user.role !== 'admin' && request.requester.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Recalculate priority if urgency or requiredBy changed
    if (updates.urgency || updates.requiredBy) {
      updates.priority = 0; // Will be recalculated
    }

    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    // Recalculate priority if needed
    if (updates.priority === 0) {
      updatedRequest.calculatePriority();
      await updatedRequest.save();
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating blood request:', error);
    res.status(500).json({ message: 'Error updating blood request' });
  }
});

// Update request status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
});

// Fulfill blood request
router.post('/:id/fulfill', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { donorId, units, date } = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (request.status === 'fulfilled') {
      return res.status(400).json({ message: 'Request already fulfilled' });
    }

    // Add fulfillment record
    request.fulfilledBy.push({
      donor: donorId,
      units,
      date: date || new Date()
    });

    // Check if request is fully fulfilled
    const totalFulfilled = request.fulfilledBy.reduce((sum, f) => sum + f.units, 0);
    if (totalFulfilled >= request.units) {
      request.status = 'fulfilled';
    } else {
      request.status = 'approved';
    }

    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Error fulfilling blood request:', error);
    res.status(500).json({ message: 'Error fulfilling blood request' });
  }
});

// Get urgent requests
router.get('/urgent/list', async (req, res) => {
  try {
    const urgentRequests = await BloodRequest.find({
      urgency: { $in: ['high', 'emergency'] },
      status: { $in: ['pending', 'approved'] }
    })
    .populate('requester', 'name')
    .sort({ priority: -1, requiredBy: 1 })
    .limit(10);

    res.json(urgentRequests);
  } catch (error) {
    console.error('Error fetching urgent requests:', error);
    res.status(500).json({ message: 'Error fetching urgent requests' });
  }
});

// Delete blood request
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // Check if user has permission to delete this request
    if (req.user.role !== 'admin' && request.requester.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow deletion if request is pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete non-pending request' });
    }

    await BloodRequest.findByIdAndDelete(id);
    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    console.error('Error deleting blood request:', error);
    res.status(500).json({ message: 'Error deleting blood request' });
  }
});

module.exports = router;
