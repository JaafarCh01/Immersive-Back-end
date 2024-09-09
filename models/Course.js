import { db } from '../src/app.js';
import { courses, lessons, modules, users, studentProgress, quizzes, tests, testResults, notifications } from '../drizzle/schema.js';
import { eq, gte } from 'drizzle-orm';

class Course {
  constructor({ id, title, description, image, category, difficulty, rating, modelUrl, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.category = category;
    this.difficulty = difficulty;
    this.rating = rating;
    this.modelUrl = modelUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create({ title, description, image, category, difficulty, rating, modelUrl }) {
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    const [course] = await db.insert(courses).values({
      title,
      description,
      image,
      category,
      difficulty,
      rating: parseFloat(rating) || 0,
      modelUrl
    }).returning();
    return new Course(course);
  }

  static async findAll({ category, difficulty, rating }) {
    let query = db.select().from(courses);
    
    console.log('Received filters:', { category, difficulty, rating });

    if (category) {
      query = query.where(eq(courses.category, category));
    }
    if (difficulty) {
      query = query.where(eq(courses.difficulty, difficulty));
    }
    if (rating) {
      query = query.where(gte(courses.rating, parseFloat(rating)));
    }
    
    console.log('Executing query:', query.toSQL());
    const result = await query;
    console.log('Query result:', result);
    return result;
  }

  static async findById(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course ? new Course(course) : null;
  }

  async update({ title, description, category, difficulty, rating }) {
    const [updatedCourse] = await db.update(courses)
      .set({ title, description, category, difficulty, rating })
      .where(eq(courses.id, this.id))
      .returning();
    Object.assign(this, updatedCourse);
    return this;
  }

  async delete() {
    await db.delete(courses).where(eq(courses.id, this.id));
  }

  async getLessons() {
    return db.select().from(lessons).where(eq(lessons.courseId, this.id));
  }

  async getStudents() {
    const [studentIds] = await db.select({ userId: users.id }).from(users).innerJoin(studentProgress).on(eq(users.id, studentProgress.userId)).where(eq(studentProgress.courseId, this.id));
    return studentIds.map(item => item.userId);
  }

  async addLesson(lessonId) {
    await db.update(lessons).set({ courseId: this.id }).where(eq(lessons.id, lessonId));
  }

  async removeLesson(lessonId) {
    await db.update(lessons).set({ courseId: null }).where(eq(lessons.id, lessonId));
  }

  async getModules() {
    return db.select().from(modules).where(eq(modules.courseId, this.id));
  }

  async addModule(moduleId) {
    await db.update(modules).set({ courseId: this.id }).where(eq(modules.id, moduleId));
  }

  async removeModule(moduleId) {
    await db.update(modules).set({ courseId: null }).where(eq(modules.id, moduleId));
  }

  async getOverallProgress(userId) {
    const progress = await db.select().from(studentProgress).where(eq(studentProgress.userId, userId)).where(eq(studentProgress.courseId, this.id));
    const lessons = await this.getLessons();

    const completedLessons = progress.filter(p => p.completed).length;
    const totalLessons = lessons.length;
    const completionPercentage = (completedLessons / totalLessons) * 100;

    const quizScores = progress.map(p => p.quizScore).filter(score => score !== null);
    const averageQuizScore = quizScores.length > 0 ? quizScores.reduce((a, b) => a + b) / quizScores.length : null;

    return {
      completedLessons,
      totalLessons,
      completionPercentage,
      averageQuizScore,
    };
  }

  async notifyStudents(message) {
    const students = await this.getStudents();
    const notifications = students.map(studentId =>
      db.insert(notifications).values({
        userId: studentId,
        message,
        type: 'course',
      })
    );
    await Promise.all(notifications);
  }
}

export default Course;