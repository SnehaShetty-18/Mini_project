const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
exports.getAllComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, issueType } = req.query;
    
    // Build where clause
    const whereClause = {};
    if (status) whereClause.status = status;
    if (issueType) whereClause.issueType = issueType;
    
    // Get complaints with pagination
    const complaints = await Complaint.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      complaints: complaints.rows,
      totalPages: Math.ceil(complaints.count / parseInt(limit)),
      currentPage: parseInt(page),
      totalComplaints: complaints.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin only)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Update complaint fields
    const { title, description, status, issueType, severity, areaType } = req.body;
    
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (status) complaint.status = status;
    if (issueType) complaint.issueType = issueType;
    if (severity) complaint.severity = severity;
    if (areaType) complaint.areaType = areaType;
    
    await complaint.save();
    
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/admin/complaints/:id
// @access  Private (Admin only)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    await complaint.destroy();
    
    res.json({ message: 'Complaint removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};