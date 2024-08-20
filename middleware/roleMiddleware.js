import { supabase } from '../src/app.js';

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { user } = await supabase.auth.getUser();

      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (!data || !allowedRoles.includes(data.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = { ...user, role: data.role };
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

export default roleMiddleware;