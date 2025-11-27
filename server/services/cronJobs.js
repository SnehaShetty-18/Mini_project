const cron = require('node-cron');
const { Op } = require('sequelize');
const Complaint = require('../models/Complaint');
const { sendEscalationNotification } = require('./notificationService');

// @desc    Check for overdue complaints and escalate them
const checkOverdueComplaints = async () => {
  try {
    console.log('Checking for overdue complaints...');
    
    // Find pending complaints that are past their escalation time
    const overdueComplaints = await Complaint.findAll({
      where: {
        status: 'pending',
        escalationTime: {
          [Op.lt]: new Date()
        }
      }
    });
    
    if (overdueComplaints.length > 0) {
      console.log(`Found ${overdueComplaints.length} overdue complaints`);
      
      for (const complaint of overdueComplaints) {
        // Update status to escalated
        complaint.status = 'escalated';
        await complaint.save();
        
        // Send escalation notification
        await sendEscalationNotification(complaint);
        
        console.log(`Complaint ${complaint.id} escalated`);
      }
    } else {
      console.log('No overdue complaints found');
    }
  } catch (error) {
    console.error('Error checking overdue complaints:', error);
  }
};

// Schedule the job to run every hour
const scheduleOverdueCheck = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', checkOverdueComplaints);
  console.log('Overdue complaints check scheduled to run every hour');
  
  // Run once immediately for testing
  // checkOverdueComplaints();
};

module.exports = { scheduleOverdueCheck };