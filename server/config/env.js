// Load environment variables from .env file
require('dotenv').config();

// Environment configuration
const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'civic_connect',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'civic_connect_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // API Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  MAP_API_KEY: process.env.MAP_API_KEY || '',
  
  // ML Service
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  
  // Client URL
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};

module.exports = config;