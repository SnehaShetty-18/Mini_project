# Civic Connect

A full-stack web application for reporting and tracking civic issues in your community.

## Overview

Civic Connect allows citizens to report civic issues like potholes, garbage overflow, and streetlight problems by simply taking a photo. The system automatically:

1. Classifies the issue type using an ML model
2. Determines the severity (High/Medium/Low)
3. Classifies the area type (Urban/Busy/Residential)
4. Allows manual location entry or GPS detection
5. Generates a detailed report using Gemini API
6. Stores everything in MySQL
7. Displays complaints in a community feed with upvoting
8. Enables real-time tracking of complaint status
9. Automatically escalates unresolved complaints

## Features

- **Image Capture & Upload**: Users can take photos or upload images of civic issues
- **Automatic Classification**: ML models classify issue type, severity, and area type
- **Location Services**: Manual entry or GPS-based location detection
- **Report Generation**: Gemini API generates detailed reports for municipal offices
- **Community Feed**: Public view of complaints with upvoting functionality
- **Real-time Tracking**: Live status updates using Socket.IO
- **Escalation System**: Automatically escalates unresolved complaints
- **Officer Dashboard**: Dedicated interface for municipal officers to manage complaints
- **User Authentication**: JWT-based authentication for citizens, officers, and admins

## Tech Stack

### Frontend
- React + Vite
- Socket.IO Client
- Axios for API requests

### Backend
- Node.js + Express
- MySQL with Sequelize ORM
- Socket.IO for real-time communication
- JWT for authentication
- Multer for file uploads

### Machine Learning
- Separate ML microservice (FastAPI)
- TensorFlow/Torch for image classification
- Geospatial analysis for area classification

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- MySQL database

## Project Structure

```
civic-connect/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API and Socket services
│   │   └── pages/       # Page components
│   └── ...
├── server/              # Express backend
│   ├── controllers/     # Request handlers
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   └── ...
├── ml-service/          # ML microservice
├── database/            # Database schema
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- MySQL (if running without Docker)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civic-connect
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Install ML service dependencies:
```bash
cd ../ml-service
pip install -r requirements.txt
```

### Environment Setup

Create a `.env` file in the server directory based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running with Docker (Recommended)

```bash
docker-compose up --build
```

This will start:
- MySQL database
- Backend API server
- Frontend client
- ML service
- Nginx reverse proxy

### Running Locally

1. Start the database (MySQL)
2. Start the ML service:
```bash
cd ml-service
python app.py
```

3. Start the backend:
```bash
cd server
npm run dev
```

4. Start the frontend:
```bash
cd client
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id/status` - Update complaint status (officers only)
- `POST /api/complaints/:id/upvote` - Upvote a complaint

### Admin
- `GET /api/admin/complaints` - Get all complaints (admin only)
- `PUT /api/admin/complaints/:id` - Update complaint (admin only)
- `DELETE /api/admin/complaints/:id` - Delete complaint (admin only)

## Database Schema

The application uses MySQL with the following tables:
- `users` - User accounts (citizens, officers, admins)
- `complaints` - Reported civic issues
- `complaint_status` - Status history for complaints
- `upvotes` - User upvotes for complaints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on the repository.