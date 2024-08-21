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
  },

  async viewDetailedUserProgress(userId) {
    const user = await User.findById(userId);
    const courseIds = await user.getCourses();
    const coursesProgress = await Promise.all(courseIds.map(async (courseId) => {
      const course = await Course.findById(courseId);
      const progress = await course.getOverallProgress(userId);
      return {
        courseId,
        courseTitle: course.title,
        ...progress
      };
    }));
    return coursesProgress;
  },

  async viewDetailedCourseProgress(userId, courseId) {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      throw new Error('User or Course not found');
    }
    const progress = await course.getOverallProgress(userId);
    return {
      courseId,
      courseTitle: course.title,
      ...progress
    };
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data;
  },

  async updateUserRole(userId, newRole) {
    const { data, error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getPlatformActivity(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate.toISOString());
    if (error) throw error;
    return data;
  },

  async getContentOverview() {
    const [courses, lessons, quizzes] = await Promise.all([
      supabase.from('courses').select('count'),
      supabase.from('lessons').select('count'),
      supabase.from('quizzes').select('count')
    ]);

    return {
      totalCourses: courses.count,
      totalLessons: lessons.count,
      totalQuizzes: quizzes.count
    };
  },

  async reviewContent(contentId, contentType, isApproved) {
    const { data, error } = await supabase
      .from(contentType)
      .update({ is_approved: isApproved })
      .eq('id', contentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};