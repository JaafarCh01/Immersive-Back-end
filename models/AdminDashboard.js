import Course from './Course.js';
import User from './User.js';
import Test from './Test.js';

export const AdminDashboardService = {
  async assignCourseToUser(courseId, userId) {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    if (course && user) {
      await user.addCourse(courseId);
      await course.addStudent(userId);
    }
  },

  async viewUserProgress(userId) {
    const user = await User.findById(userId);
    const courseIds = await user.getCourses();
    return Promise.all(courseIds.map(id => Course.findById(id)));
  },

  async viewTestResults(testId) {
    const test = await Test.findById(testId);
    return test.getResults();
  }
};