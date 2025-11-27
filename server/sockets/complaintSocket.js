// Complaint socket handlers
const setupComplaintSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to complaint socket');
    
    // Join a specific complaint room
    socket.on('joinComplaint', (complaintId) => {
      socket.join(`complaint_${complaintId}`);
      console.log(`User joined complaint room: complaint_${complaintId}`);
    });
    
    // Leave a specific complaint room
    socket.on('leaveComplaint', (complaintId) => {
      socket.leave(`complaint_${complaintId}`);
      console.log(`User left complaint room: complaint_${complaintId}`);
    });
    
    // Officer updates complaint status
    socket.on('updateComplaintStatus', async (data) => {
      try {
        const { complaintId, status, notes, officerId } = data;
        
        // In a real implementation, you would:
        // 1. Validate the officer has permission to update this complaint
        // 2. Update the complaint in the database
        // 3. Create a status history record
        // 4. Emit the update to all clients in the complaint room
        
        // For now, we'll just emit the update
        io.to(`complaint_${complaintId}`).emit('statusUpdated', {
          complaintId,
          status,
          notes,
          officerId,
          timestamp: new Date()
        });
        
        console.log(`Complaint ${complaintId} status updated to ${status}`);
      } catch (error) {
        console.error('Error updating complaint status:', error);
        socket.emit('error', { message: 'Failed to update complaint status' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected from complaint socket');
    });
  });
};

module.exports = { setupComplaintSockets };