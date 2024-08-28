import { db } from '../src/app.js';
import { tests, testResults } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

class Test {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ title, courseId }) {
    const [test] = await db.insert(tests).values({ title, courseId }).returning();
    return new Test(test);
  }

  static async findById(id) {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test ? new Test(test) : null;
  }

  async update(data) {
    const [updatedTest] = await db.update(tests).set(data).where(eq(tests.id, this.id)).returning();
    Object.assign(this, updatedTest);
    return this;
  }

  async delete() {
    await db.delete(tests).where(eq(tests.id, this.id));
  }

  async addResult(userId, score) {
    await db.insert(testResults).values({ testId: this.id, userId, score });
  }

  async getResults() {
    return db.select().from(testResults).where(eq(testResults.testId, this.id));
  }

  async notifyStudents(message) {
    const course = await this.getCourse();
    await course.notifyStudents(message);
  }

  async getCourse() {
    const [course] = await db.select().from(courses).where(eq(courses.id, this.courseId));
    return course ? new Course(course) : null;
  }
}

export default Test;