import { db } from '../src/app.js';
import { studentProgress } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

class StudentProgress {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ userId, courseId, lessonId, completed = false, quizScore = null }) {
    const [progress] = await db.insert(studentProgress)
      .values({ userId, courseId, lessonId, completed, quizScore })
      .returning();
    return new StudentProgress(progress);
  }

  static async findByUserAndCourse(userId, courseId) {
    const progress = await db.select()
      .from(studentProgress)
      .where(and(eq(studentProgress.userId, userId), eq(studentProgress.courseId, courseId)));
    return progress.map(p => new StudentProgress(p));
  }

  async update({ completed, quizScore }) {
    const [updatedProgress] = await db.update(studentProgress)
      .set({ completed, quizScore })
      .where(eq(studentProgress.id, this.id))
      .returning();
    Object.assign(this, updatedProgress);
    return this;
  }
}

export default StudentProgress;