const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Complaint = require('./Complaint');

const Upvote = sequelize.define('Upvote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  complaintId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Associations
Upvote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Upvote.belongsTo(Complaint, {
  foreignKey: 'complaintId',
  as: 'complaint'
});

// Ensure a user can only upvote a complaint once
// This is handled by database constraints, not duplicate associations

module.exports = Upvote;