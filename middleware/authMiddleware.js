import jwt from 'jsonwebtoken';
import { db } from '../src/app.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default authMiddleware;