# Announcement App

A complete MERN stack web application for managing and displaying announcements with password-protected authentication.

## Features

- 🔐 Password-protected login for posting announcements
- 📢 Public announcements display
- ✏️ Users must log in to add or delete announcements
- 🔑 JWT authentication with bcrypt password hashing
- 🗄️ MongoDB + Mongoose for data persistence
- ⚛️ React + Vite + Tailwind CSS for modern UI

## Project Structure

```
/
├── server/          # Backend (Express, MongoDB, JWT)
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── middleware/  # Authentication middleware
│   └── server.js    # Express server
└── client/          # Frontend (React + Vite + Tailwind)
    └── src/
        ├── components/  # React components
        ├── context/     # Auth context
        └── App.jsx      # Main app component
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/announcement
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. (Optional) Seed the database with a default admin user:
```bash
npm run seed
```
This will create a default user with:
- Username: `admin`
- Password: `Pr@1407rs`

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## Usage

1. **View Announcements**: Visit `http://localhost:3000` to see all public announcements
2. **Login/Register**: Click "Login" to create an account or sign in
   - Default credentials (if you ran the seed script):
     - Username: `admin`
     - Password: `Pr@1407rs`
3. **Create Announcements**: After logging in, navigate to "Manage" to create new announcements
4. **Delete Announcements**: Logged-in users can delete their own announcements

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Announcements
- `GET /api/announcements` - Get all announcements (public)
- `GET /api/announcements/:id` - Get single announcement (public)
- `POST /api/announcements` - Create announcement (protected)
- `DELETE /api/announcements/:id` - Delete announcement (protected)

## Technologies Used

### Backend
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

### Frontend
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes for authenticated users
- Input validation and sanitization
- CORS configuration

nod