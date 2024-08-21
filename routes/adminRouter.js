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

adminRouter.get('/user-progress/:userId/detailed', async (req, res) => {
  try {
    const detailedProgress = await AdminDashboardService.viewDetailedUserProgress(req.params.userId);
    res.status(200).json(detailedProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch detailed user progress' });
  }
});

adminRouter.get('/user-progress/:userId/course/:courseId', async (req, res) => {
  try {
    const courseProgress = await AdminDashboardService.viewDetailedCourseProgress(req.params.userId, req.params.courseId);
    res.status(200).json(courseProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch course progress' });
  }
});

adminRouter.get('/users', async (req, res) => {
  try {
    const users = await AdminDashboardService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

adminRouter.put('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await AdminDashboardService.updateUserRole(req.params.userId, role);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

adminRouter.get('/activity', async (req, res) => {
  try {
    const { days } = req.query;
    const activity = await AdminDashboardService.getPlatformActivity(days);
    res.status(200).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch platform activity' });
  }
});

adminRouter.get('/content-overview', async (req, res) => {
  try {
    const overview = await AdminDashboardService.getContentOverview();
    res.status(200).json(overview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch content overview' });
  }
});

adminRouter.put('/content-review/:contentType/:contentId', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const updatedContent = await AdminDashboardService.reviewContent(
      req.params.contentId,
      req.params.contentType,
      isApproved
    );
    res.status(200).json(updatedContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to review content' });
  }
});

export default adminRouter;