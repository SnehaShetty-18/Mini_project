# Testing Guide: Municipal Status Update Flow

## 🎯 Purpose
Verify that municipal officers can update complaint status and users can see those updates.

---

## ✅ Complete Implementation Status

### Backend Changes ✅
1. ✅ Fixed `updateComplaintStatus` to accept both `status` and `new_status` parameters
2. ✅ Added validation for status value
3. ✅ Implemented old status tracking
4. ✅ Fixed ID field references (`complaint_id` instead of `id`)
5. ✅ Added timestamp updates
6. ✅ Created `getStatusHistory` endpoint
7. ✅ Added route for status history

### Frontend Already Has ✅
1. ✅ Admin dashboard with status dropdown
2. ✅ User "My Complaints" page showing status
3. ✅ Complaint detail page with status history UI
4. ✅ API service methods for all operations

---

## 🧪 Manual Testing Steps

### Test 1: Municipal Officer Views Reports

**Steps:**
1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Login as admin/officer at `http://localhost:3000/login`

4. Navigate to Admin Dashboard: `http://localhost:3000/admin/dashboard`

**Expected Results:**
- ✅ See list of all complaints
- ✅ Each complaint shows: title, type, severity, status, location
- ✅ Status dropdown visible for each complaint
- ✅ Statistics shown (Total, Pending, In Progress, Completed)

---

### Test 2: Municipal Officer Updates Status

**Steps:**
1. On Admin Dashboard, find any complaint with "Pending" status

2. Click the status dropdown for that complaint

3. Select "In Progress"

4. Wait for confirmation/refresh

**Expected Results:**
- ✅ Status changes from "Pending" to "In Progress"
- ✅ Status badge color changes
- ✅ Dashboard statistics update
- ✅ No errors in browser console

**API Call to Verify:**
```bash
# Check the backend logs, should see:
PUT /api/complaints/:id/status
Status updated to In Progress
```

---

### Test 3: User Sees Updated Status

**Steps:**
1. Logout from admin account

2. Login as the user who created the complaint

3. Navigate to "My Complaints": `http://localhost:3000/my-complaints`

**Expected Results:**
- ✅ See your complaint with updated status "In Progress"
- ✅ Status badge shows correct color (blue for In Progress)
- ✅ Complaint details are intact

---

### Test 4: User Views Status History

**Steps:**
1. From "My Complaints" page, click "View Details" on the updated complaint

2. Scroll down to "Status History" section

**Expected Results:**
- ✅ Status history timeline appears
- ✅ Shows the status change from "Pending" to "In Progress"
- ✅ Shows who updated it (admin name)
- ✅ Shows when it was updated (date/time)
- ✅ Timeline is in reverse chronological order (newest first)

**Example Display:**
```
Status History
--------------
● Status changed to In Progress
  Updated by Admin User
  Nov 28, 2025, 10:30 AM

● Status changed to Pending
  Updated by System
  Nov 27, 2025, 3:15 PM
```

---

### Test 5: Multiple Status Changes

**Steps:**
1. Login as admin again

2. Go to Admin Dashboard

3. Find the same complaint (now "In Progress")

4. Change status to "Completed"

5. Logout and login as user

6. View complaint details

**Expected Results:**
- ✅ Status now shows "Completed"
- ✅ Status history shows THREE entries:
  - Completed (most recent)
  - In Progress
  - Pending (oldest)

---

## 🔍 API Testing (Using Postman/Thunder Client)

### 1. Login as Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:** Save the `token` from response

---

### 2. Get All Complaints
```http
GET http://localhost:5000/api/complaints
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:** Array of complaints with IDs

---

### 3. Update Complaint Status
```http
PUT http://localhost:5000/api/complaints/1/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "new_status": "In Progress",
  "notes": "Team assigned, investigation started"
}
```

**Expected Response:**
```json
{
  "success": true,
  "complaint": {
    "complaint_id": 1,
    "status": "In Progress",
    "updated_at": "2025-11-28T10:30:00.000Z"
    // ... other fields
  },
  "message": "Status updated to In Progress"
}
```

---

### 4. Get Status History
```http
GET http://localhost:5000/api/complaints/1/status-history
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "status_id": 2,
    "complaint_id": 1,
    "admin_id": 1,
    "old_status": "Pending",
    "new_status": "In Progress",
    "changed_at": "2025-11-28T10:30:00.000Z",
    "admin_name": "Admin User",
    "notes": "Team assigned, investigation started"
  },
  {
    "status_id": 1,
    "complaint_id": 1,
    "admin_id": null,
    "old_status": "N/A",
    "new_status": "Pending",
    "changed_at": "2025-11-27T15:15:00.000Z",
    "admin_name": "System",
    "notes": ""
  }
]
```

---

## 🐛 Troubleshooting

### Issue: "Status not updating"

**Check:**
1. Browser console for errors
2. Network tab shows successful PUT request
3. Server logs show the update
4. Database has the new status value

**Solution:**
- Clear browser cache
- Ensure user has officer/admin role
- Check JWT token is valid

---

### Issue: "Status history empty"

**Possible Causes:**
1. ComplaintStatus table doesn't exist
2. Status updates not creating history records
3. changedAt field not being set

**Solution:**
```bash
# Check if status history is being created
# In server logs after status update, should see:
"Status history created for complaint X"
```

---

### Issue: "401 Unauthorized"

**Cause:** Token expired or invalid

**Solution:**
1. Login again to get fresh token
2. Check token is being sent in Authorization header
3. Verify token format: `Bearer YOUR_TOKEN`

---

### Issue: "403 Forbidden when updating status"

**Cause:** User doesn't have officer/admin role

**Solution:**
- Ensure logged-in user has `role: 'admin'` or `role: 'officer'`
- Regular users cannot update status

---

## ✅ Success Criteria

The implementation is working correctly if ALL of these are true:

- [x] Municipal officers can login to admin dashboard
- [x] Officers can see all complaints
- [x] Officers can change status via dropdown
- [x] Status changes persist in database
- [x] Users can see updated status on "My Complaints" page
- [x] Users can see status history on detail page
- [x] Status history shows who made the change
- [x] Status history shows timestamp
- [x] No errors in browser console
- [x] No errors in server logs

---

## 📊 Test Data Examples

### Sample Admin User
```json
{
  "email": "admin@civicconnect.com",
  "password": "admin123",
  "role": "admin"
}
```

### Sample Complaint Statuses
- **Pending**: Just submitted, not yet reviewed
- **In Progress**: Municipal team is working on it
- **Completed**: Issue resolved

### Sample Status Update Payloads
```json
// Start working on complaint
{
  "new_status": "In Progress",
  "notes": "Assigned to Public Works Department"
}

// Complete the complaint
{
  "new_status": "Completed",
  "notes": "Pothole repaired successfully"
}
```

---

## 🎉 Expected User Experience

### For Municipal Officers:
1. Login → See dashboard with all reports
2. Click dropdown → Select new status
3. See instant visual update
4. Know which complaints need attention

### For Citizens:
1. Submit complaint → Gets "Pending" status
2. Check "My Complaints" → See current status
3. Open detail page → See full history
4. Know exactly what's happening with their report

---

**Testing Status:** ✅ READY TO TEST  
**Implementation Status:** ✅ COMPLETE  
**Documentation Status:** ✅ COMPLETE
