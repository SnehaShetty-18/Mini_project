const Complaint = require('../models/Complaint');
const Upvote = require('../models/Upvote');
const User = require('../models/User');
const { analyzeImage, classifySeverity, classifyAreaType } = require('../services/mlService');
const { generateReport } = require('../services/geminiService');
const { sendNotification } = require('../services/notificationService');
const { getDetailedLocationInfo } = require('../services/locationService');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    // Updated to match client-side field names
    const { title, description, issue_type, severity_level, latitude, longitude, address, place_name, district, state, country } = req.body;
    const userId = req.user ? req.user.id : null;

    // Validate required fields
    if (!title || !latitude || !longitude) {
      return res.status(400).json({ message: 'Title, latitude, and longitude are required' });
    }
    
    // Validate user authentication
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Handle image upload - allow null/empty images
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Use provided issue type or default to 'other'
    const issueType = issue_type || 'other';
    
    // Use provided severity or default to 'medium'
    const severity = severity_level || 'medium';

    // Get detailed location information using Google Maps Geocoding API
    let detailedLocation = null;
    let cityName = null;
    try {
      detailedLocation = await getDetailedLocationInfo(latitude, longitude);
      
      // Extract city name from detailed location
      if (detailedLocation) {
        // Try to get city from different sources
        if (detailedLocation.city) {
          cityName = detailedLocation.city;
        } else if (detailedLocation.address_components) {
          const components = detailedLocation.address_components;
          // Try different component types for city
          cityName = components.locality?.long_name || 
                    components.administrative_area_level_2?.long_name || 
                    components.administrative_area_level_1?.long_name ||
                    place_name || 
                    district;
        }
      }
      
      // Fallback to place_name or district if we still don't have a city
      if (!cityName) {
        cityName = place_name || district || 'Unknown';
      }
    } catch (error) {
      console.error('Detailed location info retrieval failed:', error);
      cityName = place_name || district || 'Unknown';
    }

    // Generate report using Gemini API (if needed)
    let reportUrl = '';
    try {
      // Only generate report if we have enough information
      if (title || description || imageUrl) {
        const reportData = {
          title,
          description,
          issueType,
          severity,
          address,
          latitude,
          longitude,
          detailedLocation
        };
        reportUrl = await generateReport(reportData);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    }

    // Calculate escalation time (72 hours from now)
    const escalationTime = new Date();
    escalationTime.setHours(escalationTime.getHours() + 72);

    // Create complaint with corrected field mappings
    const complaint = await Complaint.create({
      title,
      description: description || '',
      image_url: imageUrl || '', // Allow empty string instead of null
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || '',
      city: cityName,
      issue_type: issueType,
      severity_level: severity,
      report_url: reportUrl || '',
      user_id: userId, // Use the authenticated user's ID
      escalation_time: escalationTime,
      // Map missing fields to appropriate values
      region: district || state || country || 'Unknown',
      location_text: address || `${latitude}, ${longitude}`,
      gemini_report: reportUrl || '',
      upvote_count: 0,
      filed_at: new Date(),
      updated_at: new Date()
    });

    // Send notification to municipal office
    try {
      await sendNotification(complaint);
    } catch (error) {
      console.error('Notification sending failed:', error);
    }

    res.status(201).json({
      ...complaint.toJSON(),
      detailedLocation // Include detailed location info in response
    });
  } catch (error) {
    console.error('Complaint creation error:', error);
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'A similar complaint already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Failed to create complaint. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(complaints);
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    res.status(500).json({ 
      message: 'Failed to fetch complaints',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get complaints for current user
// @route   GET /api/complaints/my-complaints
// @access  Private
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(complaints);
  } catch (error) {
    console.error('Failed to fetch user complaints:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your complaints',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Failed to fetch complaint:', error);
    res.status(500).json({ 
      message: 'Failed to fetch complaint details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Officers only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    // Accept both 'status' and 'new_status' for compatibility
    const { status, new_status, notes } = req.body;
    const newStatusValue = new_status || status;
    const officerId = req.user.id;

    if (!newStatusValue) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const oldStatus = complaint.status;

    // Update complaint status
    complaint.status = newStatusValue;
    complaint.updated_at = new Date();
    await complaint.save();

    // Create status history
    const ComplaintStatus = require('../models/ComplaintStatus');
    await ComplaintStatus.create({
      complaintId: complaint.complaint_id,
      oldStatus: oldStatus,
      newStatus: newStatusValue,
      status: newStatusValue,
      updatedBy: officerId,
      notes: notes || ''
    });

    // Emit real-time update
    const io = req.app.get('socketio');
    if (io) {
      io.to(`complaint_${complaint.complaint_id}`).emit('statusUpdate', {
        complaintId: complaint.complaint_id,
        status: newStatusValue,
        oldStatus: oldStatus,
        notes,
        updatedAt: new Date()
      });
    }

    res.json({
      success: true,
      complaint: complaint,
      message: `Status updated to ${newStatusValue}`
    });
  } catch (error) {
    console.error('Failed to update complaint status:', error);
    res.status(500).json({ 
      message: 'Failed to update complaint status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Upvote a complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private
exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user already upvoted
    const existingUpvote = await Upvote.findOne({
      where: {
        userId: req.user.id,
        complaintId: req.params.id
      }
    });

    if (existingUpvote) {
      // Remove upvote
      await existingUpvote.destroy();
      complaint.upvotes -= 1;
      await complaint.save();
      return res.json({ message: 'Upvote removed', upvotes: complaint.upvotes });
    } else {
      // Add upvote
      await Upvote.create({
        userId: req.user.id,
        complaintId: req.params.id
      });
      complaint.upvotes += 1;
      await complaint.save();
      return res.json({ message: 'Upvoted', upvotes: complaint.upvotes });
    }
  } catch (error) {
    console.error('Failed to upvote complaint:', error);
    res.status(500).json({ 
      message: 'Failed to upvote complaint',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get community feed (public complaints sorted by upvotes)
// @route   GET /api/complaints/feed
// @access  Public
exports.getCommunityFeed = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: {
        status: ['pending', 'in_progress']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['upvotes', 'DESC'], ['createdAt', 'DESC']],
      limit: 50
    });

    res.json(complaints);
  } catch (error) {
    console.error('Failed to fetch community feed:', error);
    res.status(500).json({ 
      message: 'Failed to fetch community feed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get complaints by city (for admin users)
// @route   GET /api/complaints/city/:city
// @access  Private (Admin/Officer only)
exports.getComplaintsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    
    // Check if user is admin or officer
    if (req.user.role !== 'admin' && req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied. Admin or officer privileges required.' });
    }

    const complaints = await Complaint.findAll({
      where: { 
        city: city 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(complaints);
  } catch (error) {
    console.error('Failed to fetch complaints by city:', error);
    res.status(500).json({ 
      message: 'Failed to fetch city complaints',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get status history for a complaint
// @route   GET /api/complaints/:id/status-history
// @access  Private
exports.getStatusHistory = async (req, res) => {
  try {
    const ComplaintStatus = require('../models/ComplaintStatus');
    const Admin = require('../models/Admin');
    const User = require('../models/User');
    
    const history = await ComplaintStatus.findAll({
      where: { complaintId: req.params.id },
      order: [['changedAt', 'DESC']]
    });
    
    // Format the response
    const formattedHistory = await Promise.all(history.map(async (record) => {
      let updaterName = 'System';
      
      if (record.updatedBy) {
        // Try to find admin first
        const admin = await Admin.findByPk(record.updatedBy);
        if (admin) {
          updaterName = admin.name;
        } else {
          // Try to find regular user
          const user = await User.findByPk(record.updatedBy);
          if (user) {
            updaterName = user.name;
          }
        }
      }
      
      return {
        status_id: record.status_id,
        complaint_id: record.complaintId,
        admin_id: record.updatedBy,
        old_status: record.oldStatus || 'N/A',
        new_status: record.newStatus || record.status,
        changed_at: record.changedAt,
        admin_name: updaterName,
        notes: record.notes
      };
    }));
    
    res.json(formattedHistory);
  } catch (error) {
    console.error('Failed to fetch status history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch status history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};