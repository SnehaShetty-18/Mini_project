const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  upvoteComplaint,
  getUserComplaints,
  getCommunityFeed,
  getComplaintsByCity,
  getStatusHistory
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/feed', getCommunityFeed);

// Protected routes
router.route('/')
  .post(protect, upload.single('image'), createComplaint)
  .get(protect, getComplaints);

router.get('/my-complaints', protect, getUserComplaints);
router.get('/city/:city', protect, authorize('officer', 'admin'), getComplaintsByCity);
router.get('/:id/status-history', protect, getStatusHistory);
router.get('/:id', protect, getComplaint);

// Officer routes
router.put('/:id/status', protect, authorize('officer', 'admin'), updateComplaintStatus);

// Upvote route
router.post('/:id/upvote', protect, upvoteComplaint);

module.exports = router;