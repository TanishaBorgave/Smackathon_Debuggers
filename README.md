🩸 BloodBank Pro - Blood Donation Management System
🌍 Overview

BloodBankPro is a full-stack Blood Donation Management System designed to connect donors, hospitals, and blood banks in real-time. It streamlines the process of blood donation, emergency requests, and inventory management by providing a centralized platform that is efficient, reliable, and user-friendly.

This project was developed by Team Bugger’s during the SMACKATHON hackathon.

🔗 Live Demo: (BloodBank Pro) https://smackathon-bloodbank-pro.vercel.app/

🚀 Tech Stack

Frontend

React 18 (TypeScript)

Tailwind CSS

Shadcn/ui Components

Lucide React (Icons)

React Router

Backend

Node.js + Express.js

MongoDB (Mongoose ODM)

RESTful APIs

Deployment

Frontend: Vercel

Backend: Node server (localhost:5000 in dev)

⚙️ Quick Start
1️⃣ Clone the Repository
git clone https://github.com/<your-repo>.git
cd bloodbankpro

2️⃣ Start the Backend
cd server
npm install
npm run dev


Backend runs on: http://localhost:5000

3️⃣ Start the Frontend
cd client
npm install
npm run dev


Frontend runs on: http://localhost:8080

📱 Website Structure
Public Pages

/ → Home page with blood donation awareness and system overview

/donate → Donor registration form

/request → Hospital blood request form

/dashboard → Blood stock and donation overview

🗄️ Database Models
Donor Model
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

Blood Request Model
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

Blood Stock Model
{
  bloodType: String,
  units: Number,
  maxUnits: Number,
  urgency: String,
  expirationDate: Date,
  source: String,
  timestamps: true
}

🔧 API Endpoints
Donors

GET /api/donors → Fetch all donors

POST /api/donors → Register a new donor

GET /api/donors/:id → Get donor by ID

PUT /api/donors/:id → Update donor details

DELETE /api/donors/:id → Delete donor

Blood Requests

GET /api/requests → Get all requests

POST /api/requests → Create a new request

GET /api/requests/:id → Get request by ID

PUT /api/requests/:id → Update request status

DELETE /api/requests/:id → Delete request

Blood Stock

GET /api/stock → Fetch blood stock

POST /api/stock → Add blood units

PUT /api/stock/:id → Update stock

DELETE /api/stock/:id → Delete stock entry

🎨 Key Features

✅ Donor Registration → Simple donor signup with health details
✅ Hospital Requests → Hospitals can request blood instantly
✅ Stock Management → Real-time tracking of available blood units
✅ Emergency Mode → Urgent request system prioritizing critical patients
✅ Smart Dashboard → Overview of blood stock & requests
✅ Responsive UI → Mobile and desktop friendly
✅ Secure Data Handling → MongoDB with Mongoose schema validation

🔍 How It Works

Donors register with their details (blood type, contact info, health stats).

Hospitals submit blood requests via the request form with urgency levels.

System checks inventory and matches requests with available blood units.

Dashboard updates in real-time, showing blood stock levels, pending requests, and fulfilled donations.

Admins/Blood banks manage stock by adding or updating units in the system.

👨‍💻 Team Bugger’s

This project was built by Team Bugger’s 💡

Tanisha Borgave

Ayush Bhat 

Muskan Fakir 

Shrushti Siriya 

Anubhav Verma 

🐛 Troubleshooting
1. Backend not running
cd server
npm run dev

2. MongoDB connection failed

Ensure MongoDB is running at mongodb://localhost:27017

Verify server/config.env

3. Frontend port conflicts

Vite will auto-assign next port (check terminal output).

📞 Support

If you face any issues:

Check the troubleshooting section

Verify all services are running

Inspect browser console & server logs

Ensure MongoDB is accessible

🎉 Conclusion

BloodBank Pro provides a centralized, real-time platform for blood donation and emergency requests. By bridging the gap between donors, hospitals, and blood banks, it makes the blood donation process faster, smarter, and more accessible.

✨ Made with ❤️ by Team Bugger’s for SMACKATHON ✨
