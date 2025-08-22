const express = require('express');
const BloodStock = require('../models/BloodStock');
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

// Get all blood stock
router.get('/', async (req, res) => {
  try {
    const bloodStock = await BloodStock.find({ status: 'available' })
      .populate('hospital', 'name')
      .sort({ bloodType: 1, expirationDate: 1 });

    res.json(bloodStock);
  } catch (error) {
    console.error('Error fetching blood stock:', error);
    res.status(500).json({ message: 'Error fetching blood stock' });
  }
});

// Get blood stock by blood type
router.get('/type/:bloodType', async (req, res) => {
  try {
    const { bloodType } = req.params;
    const stock = await BloodStock.find({ 
      bloodType, 
      status: 'available' 
    }).populate('hospital', 'name');

    res.json(stock);
  } catch (error) {
    console.error('Error fetching blood stock by type:', error);
    res.status(500).json({ message: 'Error fetching blood stock' });
  }
});

// Get blood stock summary (dashboard view)
router.get('/summary', async (req, res) => {
  try {
    const summary = await BloodStock.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: '$bloodType',
          totalUnits: { $sum: '$units' },
          maxUnits: { $max: '$maxUnits' },
          locations: { $addToSet: '$hospital' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate urgency levels
    const stockWithUrgency = summary.map(item => {
      const urgency = item.totalUnits <= 20 ? 'high' : 
                     item.totalUnits <= 50 ? 'medium' : 'low';
      
      return {
        ...item,
        urgency,
        percentage: Math.round((item.totalUnits / item.maxUnits) * 100)
      };
    });

    res.json(stockWithUrgency);
  } catch (error) {
    console.error('Error fetching blood stock summary:', error);
    res.status(500).json({ message: 'Error fetching blood stock summary' });
  }
});

// Add new blood stock (admin/hospital only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'hospital'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const { bloodType, units, maxUnits, hospital, location, expirationDate, source, notes } = req.body;

    const newStock = new BloodStock({
      bloodType,
      units,
      maxUnits,
      hospital: req.user.role === 'hospital' ? req.user.userId : hospital,
      location,
      expirationDate,
      source,
      notes
    });

    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    console.error('Error adding blood stock:', error);
    res.status(500).json({ message: 'Error adding blood stock' });
  }
});

// Update blood stock
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'hospital'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const { id } = req.params;
    const updates = req.body;

    const stock = await BloodStock.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'Blood stock not found' });
    }

    res.json(stock);
  } catch (error) {
    console.error('Error updating blood stock:', error);
    res.status(500).json({ message: 'Error updating blood stock' });
  }
});

// Reserve blood units
router.post('/:id/reserve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { units } = req.body;

    const stock = await BloodStock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: 'Blood stock not found' });
    }

    if (stock.status !== 'available') {
      return res.status(400).json({ message: 'Blood stock is not available' });
    }

    if (stock.units < units) {
      return res.status(400).json({ message: 'Insufficient units available' });
    }

    stock.units -= units;
    if (stock.units === 0) {
      stock.status = 'reserved';
    }

    await stock.save();
    res.json(stock);
  } catch (error) {
    console.error('Error reserving blood units:', error);
    res.status(500).json({ message: 'Error reserving blood units' });
  }
});

// Get expiring blood stock (within specified days)
router.get('/expiring/:days', async (req, res) => {
  try {
    const { days } = req.params;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days));

    const expiringStock = await BloodStock.find({
      expirationDate: { $lte: targetDate },
      status: 'available'
    }).populate('hospital', 'name');

    res.json(expiringStock);
  } catch (error) {
    console.error('Error fetching expiring blood stock:', error);
    res.status(500).json({ message: 'Error fetching expiring blood stock' });
  }
});

module.exports = router;
