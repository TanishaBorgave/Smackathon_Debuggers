# 🩸 LifeLink - Authentication System Documentation

## Overview
LifeLink is a comprehensive Blood Donation Management System with role-based authentication and different dashboards for various user types.

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
The frontend will run on `http://localhost:8084` (or next available port)

### 3. Access Test Accounts
Visit `http://localhost:8084/test-accounts.html` to see all available test accounts.

## 👥 User Roles & Dashboards

### 👑 Administrator
- **Purpose**: System management and oversight
- **Dashboard**: `/admin-dashboard`
- **Features**:
  - User management
  - System monitoring
  - Administrative controls
  - Activity logs

**Test Account:**
- Email: `admin@lifelink.com`
- Password: `admin123`

### 🏥 Hospital Staff
- **Purpose**: Blood bank management and patient care
- **Dashboard**: `/hospital-dashboard`
- **Features**:
  - Blood stock management
  - Patient blood requests
  - Donation coordination
  - Inventory tracking

**Test Account:**
- Email: `hospital@citygeneral.com`
- Password: `hospital123`

### 🩸 Blood Donor
- **Purpose**: Personal donation management
- **Dashboard**: `/dashboard`
- **Features**:
  - Donation history
  - Appointment scheduling
  - Health tracking
  - Personal statistics

**Test Account:**
- Email: `john.smith@email.com`
- Password: `donor123`

## 🔐 Authentication Flow

### 1. Role-Based Login
- Visit `/role-login` to access the tabbed login interface
- Choose your role (Donor, Hospital, Admin)
- Enter credentials
- Get redirected to appropriate dashboard based on role

### 2. Protected Routes
- All dashboards are protected with `PrivateRoute` component
- Unauthenticated users are redirected to login
- Role-based access control ensures users only see their designated dashboards

### 3. JWT Token Management
- Tokens are stored in localStorage
- Automatic logout on token expiration
- Secure API calls with Authorization headers

## 📱 Available Pages

### Public Pages
- `/` - Home page
- `/login` - Basic login
- `/register` - User registration
- `/role-login` - Role-based login (recommended)
- `/test-accounts.html` - Test account showcase

### Protected Pages
- `/dashboard` - Donor dashboard
- `/admin-dashboard` - Administrator dashboard
- `/hospital-dashboard` - Hospital staff dashboard

### Other Pages
- `/donate` - Blood donation registration
- `/request` - Blood request form

## 🧪 Testing the System

### 1. Test All User Roles
```bash
# Test Admin
1. Go to /role-login
2. Select "Admin" tab
3. Login with admin@lifelink.com / admin123
4. Access admin-dashboard

# Test Hospital
1. Go to /role-login
2. Select "Hospital" tab
3. Login with hospital@citygeneral.com / hospital123
4. Access hospital-dashboard

# Test Donor
1. Go to /role-login
2. Select "Donor" tab
3. Login with john.smith@email.com / donor123
4. Access dashboard
```

### 2. Test Protected Routes
- Try accessing `/admin-dashboard` without logging in
- You should be redirected to login page
- After login, you should access the appropriate dashboard

### 3. Test Role Switching
- Logout from one role
- Login with different role credentials
- Verify you see the correct dashboard

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['donor', 'admin', 'hospital'],
  phone: String,
  address: Object,
  isActive: Boolean,
  timestamps: true
}
```

### Donor Model (for donor users)
```javascript
{
  userId: ObjectId (ref: User),
  bloodType: String,
  dateOfBirth: Date,
  gender: String,
  weight: Number,
  height: Number
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Admin (Protected)
- `GET /api/admin/users` - Get all users

### Hospital (Protected)
- `GET /api/hospitals/blood-stock` - Get blood stock
- `POST /api/hospitals/requests` - Create blood request

## 🎨 UI Components

### Built with:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons
- **React Router** for navigation

### Key Components:
- `PrivateRoute` - Route protection
- `RoleBasedLogin` - Tabbed login interface
- `Navigation` - Dynamic navigation based on auth status
- `AdminDashboard` - Administrative interface
- `HospitalDashboard` - Hospital management interface
- `Dashboard` - Donor personal interface

## 🚨 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Different dashboards per role
- **Protected Routes**: Automatic redirects for unauthorized access
- **Input Validation**: Server-side validation with express-validator

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

4. **Authentication errors**
   - Clear localStorage and try again
   - Check browser console for error messages
   - Verify backend server is running

### Database Reset:
```bash
cd server
node seedDatabase.js
```

## 📝 Sample Data

The system comes pre-populated with:

- **2 Admin users** (admin@lifelink.com, sysadmin@lifelink.com)
- **3 Hospital users** (various hospital emails)
- **5 Donor users** (various donor emails)

All passwords are simple for testing: `admin123`, `hospital123`, `donor123`

## 🎯 Next Steps

### Potential Enhancements:
1. **Email Verification** - Send confirmation emails
2. **Password Reset** - Forgot password functionality
3. **Two-Factor Authentication** - Enhanced security
4. **Session Management** - Better token handling
5. **Audit Logs** - Track all system activities
6. **Real-time Updates** - WebSocket integration

### API Expansion:
1. **Blood Inventory Management**
2. **Donation Scheduling**
3. **Emergency Request System**
4. **Reporting & Analytics**
5. **Mobile API Endpoints**

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all services are running
3. Check browser console and server logs
4. Ensure MongoDB is accessible

---

**Happy Testing! 🎉**

The LifeLink system is now ready for comprehensive testing with multiple user roles and secure authentication.
