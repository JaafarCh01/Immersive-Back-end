import { db } from '../src/app.js';
import { users, courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Enrollment from './Enrollment.js';

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ email, password, role = 'student' }) {
    const [user] = await db.insert(users).values({ email, password, role }).returning();
    return new User(user);
  }

  static async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? new User(user) : null;
  }

  static async findByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ? new User(user) : null;
  }

  async update(data) {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, this.id)).returning();
    Object.assign(this, updatedUser);
    return this;
  }

  async delete() {
    await db.delete(users).where(eq(users.id, this.id));
  }

  async getCourses() {
    return db.select().from(courses).where(eq(courses.userId, this.id));
  }

  async enrollInCourse(courseId) {
    const existingEnrollment = await Enrollment.findByUserAndCourse(this.id, courseId);
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }
    return await Enrollment.create({ userId: this.id, courseId });
  }

  async comparePassword(password) {
    // In a real application, you should use bcrypt to compare hashed passwords
    return this.password === password;
  }
}

export default User;