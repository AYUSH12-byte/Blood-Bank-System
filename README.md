# Blood Donation System

A comprehensive web application designed to manage blood donation activities, connecting blood donors with recipients and providing administrative oversight.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Role-Based Access Control** - Admin, Donor, and Receiver roles

### Donor Features
- Create and manage donation records
- View personal donation history
- Update profile information
- Search and view available blood requests

### Receiver Features
- Create blood donation requests
- Search for available donors
- View request status
- Manage personal profile

### Admin Dashboard
- Monitor all users (donors and receivers)
- Track all blood donations
- Manage blood stock inventory
- View system-wide statistics

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Email Service:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS
- **Code Quality:** ESLint

## 📁 Project Structure

```
blood-donation-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database configuration
│   │   └── mailer.js          # Email configuration
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── adminController.js     # Admin operations
│   │   ├── donorController.js     # Donor operations
│   │   └── receiverController.js  # Receiver operations
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # Database models
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── adminRoutes.js     # Admin endpoints
│   │   ├── donorRoutes.js     # Donor endpoints
│   │   └── receiverRoutes.js  # Receiver endpoints
│   ├
│   │   
│   ├── database.sql           # Database schema
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx     # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── auth/          # Auth pages (login, register, etc.)
│   │   │   ├── donor/         # Donor pages
│   │   │   └── receiver/      # Receiver pages
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Route protection component
│   │   ├── api/
│   │   │   └── axios.js       # Axios configuration
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # React entry point
│   │   └── assets/            # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md 
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blood-donation-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # or create manually with required variables

# Set up database
mysql -u your_mysql_user -p < database.sql
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## ▶️ Running the Application

### Development Mode

#### Backend (in the backend directory)
```bash
npm run dev
```
The server will run on `http://localhost:5000` (or your configured PORT)

#### Frontend (in the frontend directory)
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

#### Backend
```bash
npm start
```

#### Frontend
```bash
npm run build
npm run preview
```


## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password with token
- `POST /refresh` - Refresh JWT token
- `POST /logout` - Logout user
- `GET /me` - Get current user info

### Donor Routes (`/api/donor`)
- View and manage donation history
- Update donor profile

### Receiver Routes (`/api/receiver`)
- Create and manage blood requests
- Search available donors
- Update receiver profile

### Admin Routes (`/api/admin`)
- Manage users (donors and receivers)
- View all donations
- Manage blood stock
- View system statistics

## 💡 Usage

### As an Admin
1. Register/Login as an admin
2. Access the admin dashboard
3. Monitor users, donations, and blood inventory
4. View system-wide statistics

### As a Donor
1. Register as a donor
2. Update profile information
3. View available blood requests
4. Donate blood and view history

### As a Receiver
1. Register as a receiver
2. Create blood donation requests
3. Search for available donors
4. Track request status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📧 Support

For support,ayuchy93858@example.com or open an issue in the repository.

---

**Happy Coding! 🎉**
