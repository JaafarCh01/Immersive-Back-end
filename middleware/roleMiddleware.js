import { db } from '../src/app.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const [user] = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, req.user.id));

      console.log('User role:', user?.role);
      console.log('Allowed roles:', allowedRoles);

      if (!user || !allowedRoles.map(role => role.toLowerCase()).includes(user.role.toLowerCase())) {
        console.log('Access denied for user:', req.user.id);
        return res.status(403).json({ message: "Access denied" });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

export default roleMiddleware;