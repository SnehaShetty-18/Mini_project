const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Complaint = sequelize.define('Complaint', {
  complaint_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admin_id: {
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  issue_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  severity_level: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pending'
  },
  image_url: {
    type: DataTypes.STRING(300),
    allowNull: true // Allow null values for image_url
  },
  location_text: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  gemini_report: {
    type: DataTypes.TEXT
  },
  region: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  upvote_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  filed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'complaints',
  timestamps: false
});

// Associations
Complaint.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = Complaint;