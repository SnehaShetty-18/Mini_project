const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Complaint = require('./Complaint');
const User = require('./User');

const ComplaintStatus = sequelize.define('ComplaintStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  complaintId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'escalated'),
    defaultValue: 'pending'
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Associations
ComplaintStatus.belongsTo(Complaint, {
  foreignKey: 'complaintId',
  as: 'complaint'
});

ComplaintStatus.belongsTo(User, {
  foreignKey: 'updatedBy',
  as: 'officer'
});

module.exports = ComplaintStatus;