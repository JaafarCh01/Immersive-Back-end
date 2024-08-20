import express from 'express';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { AdminDashboardService } from '../models/AdminDashboard.js';

const adminRouter = express.Router();

adminRouter.use(roleMiddleware(['ADMIN']));

adminRouter.post('/assign-course', async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    await AdminDashboardService.assignCourseToUser(courseId, userId);
    res.status(200).json({ message: 'Course assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to assign course' });
  }
});

adminRouter.get('/user-progress/:userId', async (req, res) => {
  try {
    const progress = await AdminDashboardService.viewUserProgress(req.params.userId);
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
});

adminRouter.get('/test-results/:testId', async (req, res) => {
  try {
    const results = await AdminDashboardService.viewTestResults(req.params.testId);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch test results' });
  }
});

export default adminRouter;