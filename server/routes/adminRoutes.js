const express = require('express');
const { getAllComplaints, updateComplaint, deleteComplaint } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/complaints')
  .get(getAllComplaints);

router.route('/complaints/:id')
  .put(updateComplaint)
  .delete(deleteComplaint);

module.exports = router;