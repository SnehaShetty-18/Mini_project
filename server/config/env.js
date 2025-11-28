const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate and export environment configuration
const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  DB_DIALECT: process.env.DB_DIALECT || 'sqlite',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: process.env.DB_NAME || 'civic_connect',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_STORAGE: process.env.DB_STORAGE || './database.sqlite',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'civic_connect_default_secret_key_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // API Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  MAP_API_KEY: process.env.MAP_API_KEY || '',
  
  // URLs
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3003',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  
  // ML Service
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000'
};

// Validate critical environment variables
const validateConfig = () => {
  const warnings = [];
  
  if (!config.GEMINI_API_KEY) {
    warnings.push('⚠️  GEMINI_API_KEY is not set. Report generation will use simulated responses.');
  }
  
  if (!config.MAP_API_KEY) {
    warnings.push('⚠️  MAP_API_KEY is not set. Some location features may be limited.');
  }
  
  if (config.JWT_SECRET === 'civic_connect_default_secret_key_change_in_production' && config.NODE_ENV === 'production') {
    warnings.push('🚨 CRITICAL: Using default JWT_SECRET in production! Please set a secure JWT_SECRET.');
  }
  
  if (warnings.length > 0) {
    console.log('\n📋 Configuration Warnings:');
    warnings.forEach(warning => console.log(warning));
    console.log('');
  }
};

// Run validation on load
validateConfig();

module.exports = config;
