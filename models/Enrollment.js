import { db } from '../src/app.js';
import { enrollments } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

class Enrollment {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ userId, courseId }) {
    const [enrollment] = await db.insert(enrollments)
      .values({ userId, courseId })
      .returning();
    return new Enrollment(enrollment);
  }

  static async findByUserAndCourse(userId, courseId) {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment ? new Enrollment(enrollment) : null;
  }
}

export default Enrollment;
