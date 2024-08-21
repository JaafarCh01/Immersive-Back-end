import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import Notification from '../models/Notification.js';

const studentRouter = express.Router();

studentRouter.use(authMiddleware);
studentRouter.use(roleMiddleware(['STUDENT']));

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

export default studentRouter;
