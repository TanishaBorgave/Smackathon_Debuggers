# Blood Donation Management System

A full-stack MERN (MongoDB, Express.js, React → HTML/CSS/JavaScript) application for managing blood donations, requests, and inventory.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Donor Management**: Complete donor profiles with eligibility tracking
- **Blood Stock Management**: Real-time inventory tracking with expiration dates
- **Blood Requests**: Submit and manage blood requests with priority levels
- **Dashboard**: Comprehensive overview of blood stock and requests
- **Responsive Design**: Mobile-first design that works on all devices
- **Role-based Access**: Different permissions for donors, hospitals, and admins

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - ES6+ features and modern APIs
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Project Structure

```
Smackathon_Debuggers/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── config.env         # Environment variables
├── public/                # Frontend static files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── assets/           # Images and other assets
│   └── index.html        # Main HTML file
└── README.md             # This file
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Smackathon_Debuggers
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Set up environment variables
Create a `.env` file in the server directory:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donation
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Start the backend server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Open the frontend
Open `public/index.html` in your web browser or serve it using a local server.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Blood Stock
- `GET /api/stock` - Get all blood stock
- `GET /api/stock/summary` - Get blood stock summary
- `POST /api/stock` - Add new blood stock
- `PUT /api/stock/:id` - Update blood stock
- `GET /api/stock/expiring/:days` - Get expiring blood stock

### Blood Requests
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create blood request
- `PUT /api/requests/:id` - Update blood request
- `PATCH /api/requests/:id/status` - Update request status
- `GET /api/requests/urgent/list` - Get urgent requests

### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/profile/me` - Get current donor profile
- `PUT /api/donors/profile/me` - Update donor profile
- `GET /api/donors/eligible/donation` - Get eligible donors

## Usage

### For Donors
1. **Register**: Create an account with your blood type and personal information
2. **Login**: Access your donor profile
3. **Submit Requests**: Request blood for patients in need
4. **View Profile**: Manage your donor information

### For Hospitals
1. **Login**: Access hospital dashboard
2. **Manage Stock**: Add, update, and monitor blood inventory
3. **Handle Requests**: Review and fulfill blood requests
4. **Track Expiration**: Monitor blood units approaching expiration

### For Administrators
1. **User Management**: Manage all users and their roles
2. **System Overview**: Monitor overall system statistics
3. **Eligibility Control**: Manage donor eligibility
4. **Data Analytics**: View comprehensive reports

## Features in Detail

### Blood Stock Management
- Real-time inventory tracking
- Expiration date monitoring
- Urgency level indicators
- Stock level alerts
- Multi-location support

### Request Management
- Priority-based queuing
- Urgency level classification
- Status tracking
- Fulfillment recording
- Automated notifications

### Donor Management
- Comprehensive health screening
- Eligibility tracking
- Donation history
- Medical history management
- Emergency contact information

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure API endpoints

## Customization

### Styling
The application uses CSS custom properties (variables) for easy theming:
```css
:root {
    --primary-color: #dc2626;
    --secondary-color: #1e40af;
    --accent-color: #059669;
    /* ... more variables */
}
```

### Configuration
Modify the `config.env` file to change:
- Server port
- Database connection string
- JWT secret key
- Environment settings

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "blood-donation-api"
   ```

### Frontend Deployment
1. Copy the `public` folder to your web server
2. Ensure all static assets are accessible
3. Configure your web server to serve `index.html` for all routes

### Database Deployment
1. Use MongoDB Atlas for cloud hosting
2. Set up proper authentication and network access
3. Configure connection string in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `config.env`
- Verify network access and authentication

**JWT Token Issues**
- Check JWT_SECRET in environment variables
- Ensure token expiration settings
- Verify token format in requests

**CORS Errors**
- Check CORS configuration in server.js
- Verify frontend URL in CORS settings

**Port Already in Use**
- Change PORT in environment variables
- Kill existing processes using the port
- Use `npm run dev` for development

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Mobile App**: React Native or Flutter mobile application
- **Advanced Analytics**: Data visualization and reporting
- **Integration**: Hospital management system integration
- **AI Features**: Predictive analytics for blood demand
- **Geolocation**: Find nearby donation centers
- **Social Features**: Community engagement and gamification

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, data validation, and compliance with healthcare regulations.
