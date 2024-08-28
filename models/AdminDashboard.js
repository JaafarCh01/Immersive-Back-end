import { db } from '../src/app.js';
import { users, activityLogs, courses, lessons, quizzes } from '../drizzle/schema.js';
import { eq, gte } from 'drizzle-orm';

export const AdminDashboardService = {
  async getAllUsers() {
    return db.select().from(users);
  },

  async updateUserRole(userId, newRole) {
    const [updatedUser] = await db.update(users).set({ role: newRole }).where(eq(users.id, userId)).returning();
    return updatedUser;
  },

  async getPlatformActivity(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return db.select().from(activityLogs).where(gte(activityLogs.createdAt, startDate));
  },

  async getContentOverview() {
    const [coursesCount] = await db.select({ count: sql`count(*)` }).from(courses);
    const [lessonsCount] = await db.select({ count: sql`count(*)` }).from(lessons);
    const [quizzesCount] = await db.select({ count: sql`count(*)` }).from(quizzes);

    return {
      totalCourses: coursesCount.count,
      totalLessons: lessonsCount.count,
      totalQuizzes: quizzesCount.count
    };
  },

  async assignCourseToUser(courseId, userId) {
    const course = await db.select().from(courses).where(eq(courses.id, courseId));
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (course && user) {
      await db.insert(user.courses).values({ courseId });
      await db.insert(course.students).values({ userId });
    }
  },

  async viewUserProgress(userId) {
    const user = await db.select().from(users).where(eq(users.id, userId));
    const courseIds = await db.select().from(user.courses);
    return Promise.all(courseIds.map(id => db.select().from(courses).where(eq(courses.id, id))));
  },

  async viewTestResults(testId) {
    const test = await db.select().from(tests).where(eq(tests.id, testId));
    return db.select().from(testResults).where(eq(testResults.testId, test.id));
  },

  async viewDetailedUserProgress(userId) {
    const user = await db.select().from(users).where(eq(users.id, userId));
    const courseIds = await db.select().from(user.courses);
    const coursesProgress = await Promise.all(courseIds.map(async courseId => {
      const course = await db.select().from(courses).where(eq(courses.id, courseId));
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
    const user = await db.select().from(users).where(eq(users.id, userId));
    const course = await db.select().from(courses).where(eq(courses.id, courseId));
    if (!user || !course) {
      throw new Error('User or Course not found');
    }
    const progress = await course.getOverallProgress(userId);
    return {
      courseId,
      courseTitle: course.title,
      ...progress
    };
  }
};