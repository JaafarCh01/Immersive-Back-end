// models/Module.js

import { db } from '../src/app.js';
import { modules, lessons } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

class Module {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ title, courseId }) {
    const [module] = await db.insert(modules)
      .values({ title, courseId })
      .returning();
    return new Module(module);
  }

  static async findById(id) {
    const [module] = await db.select()
      .from(modules)
      .where(eq(modules.id, id));
    return module ? new Module(module) : null;
  }

  async update(data) {
    const [updatedModule] = await db.update(modules)
      .set(data)
      .where(eq(modules.id, this.id))
      .returning();
    Object.assign(this, updatedModule);
    return this;
  }

  async delete() {
    await db.delete(modules).where(eq(modules.id, this.id));
  }

  async getLessons() {
    return db.select().from(lessons).where(eq(lessons.moduleId, this.id));
  }
}

export default Module;