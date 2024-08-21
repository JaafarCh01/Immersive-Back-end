import { supabase } from '../src/app.js';

const authMiddleware = async (req, res, next) => {
  try {
    const { user } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default authMiddleware;
