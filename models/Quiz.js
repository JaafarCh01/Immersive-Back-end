import { db } from '../src/app.js';
import { quizzes, lessons } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

class Quiz {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ title, lessonId, questions }) {
    const [quiz] = await db.insert(quizzes).values({ title, lessonId, questions }).returning();
    return new Quiz(quiz);
  }

  static async findById(id) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz ? new Quiz(quiz) : null;
  }

  async update(data) {
    const [updatedQuiz] = await db.update(quizzes).set(data).where(eq(quizzes.id, this.id)).returning();
    Object.assign(this, updatedQuiz);
    return this;
  }

  async delete() {
    await db.delete(quizzes).where(eq(quizzes.id, this.id));
  }

  async getLesson() {
    return db.select().from(lessons).where(eq(lessons.id, this.lessonId));
  }
}

export default Quiz;