const axios = require('axios');

// @desc    Send notification to municipal office
// @param   complaint - Complaint object
exports.sendNotification = async (complaint) => {
  try {
    // In a real implementation, this would send emails, SMS, or webhook notifications
    // For now, we'll simulate the response
    
    console.log('Sending notification for complaint:', complaint.id);
    
    // Example email notification:
    /*
    await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [{
        to: [{ email: 'municipal-office@example.com' }],
        subject: `New Civic Complaint: ${complaint.title}`
      }],
      from: { email: 'no-reply@civicconnect.com' },
      content: [{
        type: 'text/html',
        value: `
          <h2>New Civic Complaint</h2>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Type:</strong> ${complaint.issueType}</p>
          <p><strong>Severity:</strong> ${complaint.severity}</p>
          <p><strong>Location:</strong> ${complaint.address || `(${complaint.latitude}, ${complaint.longitude})`}</p>
          <p><strong>Description:</strong> ${complaint.description}</p>
          <p><a href="${process.env.CLIENT_URL}/complaints/${complaint.id}">View Complaint</a></p>
        `
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    */
    
    // Example webhook notification:
    /*
    await axios.post(process.env.MUNICIPAL_WEBHOOK_URL, {
      event: 'new_complaint',
      complaint: complaint
    });
    */
    
    return true;
  } catch (error) {
    console.error('Notification sending failed:', error);
    throw new Error('Failed to send notification');
  }
};

// @desc    Send escalation notification to news outlet
// @param   complaint - Complaint object
exports.sendEscalationNotification = async (complaint) => {
  try {
    // In a real implementation, this would send to a news outlet or social media
    // For now, we'll simulate the response
    
    console.log('Sending escalation notification for complaint:', complaint.id);
    
    // Example webhook to news outlet:
    /*
    await axios.post(process.env.NEWS_OUTLET_WEBHOOK_URL, {
      event: 'escalated_complaint',
      complaint: complaint
    });
    */
    
    return true;
  } catch (error) {
    console.error('Escalation notification sending failed:', error);
    throw new Error('Failed to send escalation notification');
  }
};