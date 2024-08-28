import { db } from '../src/app.js';
import { lessons, modules, courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Course from './Course.js';

class Lesson {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ title, content, courseId, moduleId = null }) {
    const [lesson] = await db.insert(lessons)
      .values({ title, content, courseId, moduleId })
      .returning();
    return new Lesson(lesson);
  }

  static async findById(id) {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson ? new Lesson(lesson) : null;
  }

  async update(data) {
    const [updatedLesson] = await db.update(lessons)
      .set(data)
      .where(eq(lessons.id, this.id))
      .returning();
    Object.assign(this, updatedLesson);
    return this;
  }

  async delete() {
    await db.delete(lessons).where(eq(lessons.id, this.id));
  }

  async getModule() {
    if (!this.moduleId) return null;
    const [module] = await db.select().from(modules).where(eq(modules.id, this.moduleId));
    return module;
  }

  async getCourse() {
    const [course] = await db.select().from(courses).where(eq(courses.id, this.courseId));
    return course ? new Course(course) : null;
  }

  async setModule(moduleId) {
    await this.update({ moduleId });
  }

  async removeFromModule() {
    await this.update({ moduleId: null });
  }
}

export default Lesson;