import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

const studentRouter = express.Router();

studentRouter.use(authMiddleware);
studentRouter.use(roleMiddleware(['student']));

studentRouter.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user.id);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

studentRouter.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification || notification.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const updatedNotification = await notification.markAsRead();
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

studentRouter.post('/enroll', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    
    const existingEnrollment = await Enrollment.findByUserAndCourse(userId, courseId);
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }
    
    const enrollment = await Enrollment.create({ userId, courseId });
    res.status(201).json({ message: 'Successfully enrolled in the course', enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Failed to enroll in the course' });
  }
});

export default studentRouter;
