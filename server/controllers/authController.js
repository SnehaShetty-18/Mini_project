const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const config = require('../config/env');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash
    });

    // Generate token
    const token = generateToken(user.user_id);

    res.status(201).json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Check for admin if user not found
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check admin password
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token for admin
      const token = generateToken(admin.admin_id);

      return res.json({
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token
      });
    }

    // Check user password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token for user
    const token = generateToken(user.user_id);

    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: 'user',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          user_id: {
            [Op.ne]: req.user.id
          }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update user
    const [updatedRows] = await User.update(
      { name, email },
      { where: { user_id: req.user.id } }
    );
    
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get updated user data
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    // Delete user
    const deletedRows = await User.destroy({
      where: { user_id: req.user.id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register admin user
// @route   POST /api/auth/admin-register
// @access  Public
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password, municipal_office, region } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ where: { email } });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password_hash,
      municipal_office,
      region
    });

    res.status(201).json({
      id: admin.admin_id,
      name: admin.name,
      email: admin.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};