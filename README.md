# 🩸 LifeLink - Blood Donation Management System

## Overview
LifeLink is a comprehensive Blood Donation Management System that connects blood banks, hospitals, and donors in real-time. The system provides a platform for blood donation coordination, emergency requests, and inventory management.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
npm run dev
```
The frontend will run on `http://localhost:8080`

## 📱 Available Pages

### Public Pages
- `/` - Home page with blood donation information
- `/donate` - Blood donation registration form
- `/request` - Blood request form for hospitals
- `/dashboard` - Blood stock and donation overview

## 🗄️ Database Schema

### Donor Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  bloodType: String,
  dateOfBirth: Date,
  gender: String,
  weight: Number,
  height: Number,
  address: Object,
  isActive: Boolean,
  timestamps: true
}
```

### Blood Request Model
```javascript
{
  hospitalName: String,
  bloodType: String,
  units: Number,
  urgency: String,
  patientName: String,
  doctorName: String,
  contactPhone: String,
  status: String,
  timestamps: true
}
```

### Blood Stock Model
```javascript
{
  bloodType: String,
  units: Number,
  maxUnits: Number,
  urgency: String,
  expirationDate: Date,
  source: String,
  timestamps: true
}
```

## 🔧 API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create new donor
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Blood Requests
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create new blood request
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Delete request

### Blood Stock
- `GET /api/stock` - Get current blood stock
- `POST /api/stock` - Add blood units
- `PUT /api/stock/:id` - Update stock levels
- `DELETE /api/stock/:id` - Remove blood units

## 🎨 UI Components

### Built with:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons
- **React Router** for navigation

### Key Components:
- `Navigation` - Main navigation bar
- `Dashboard` - Blood stock overview
- `DonorRegistration` - Donor signup form
- `BloodRequest` - Hospital request form

## 🚨 Features

- **Blood Donation Management** - Track donors and donations
- **Emergency Requests** - Hospitals can request blood urgently
- **Inventory Tracking** - Monitor blood stock levels
- **Real-time Updates** - Live blood availability information
- **Responsive Design** - Works on all devices

## 🐛 Troubleshooting

### Common Issues:

1. **Backend not running**
   ```bash
   cd server
   npm run dev
   ```

2. **MongoDB connection failed**
   - Ensure MongoDB is running on localhost:27017
   - Check server/config.env file

3. **Frontend port conflicts**
   - Vite will automatically find next available port
   - Check terminal output for actual port number

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all services are running
3. Check browser console and server logs
4. Ensure MongoDB is accessible

---

**Happy Blood Donation Management! 🎉**

The LifeLink system is now ready for blood donation coordination without authentication requirements.
