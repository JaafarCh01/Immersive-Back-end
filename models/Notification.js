import { db } from '../src/app.js';
import { notifications } from '../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

class Notification {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create({ userId, message, type }) {
    const [notification] = await db.insert(notifications)
      .values({ userId, message, type, read: false })
      .returning();
    return new Notification(notification);
  }

  static async findByUser(userId) {
    const notificationList = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    return notificationList.map(notification => new Notification(notification));
  }

  async markAsRead() {
    const [updatedNotification] = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, this.id))
      .returning();
    Object.assign(this, updatedNotification);
    return this;
  }
}

export default Notification;