import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from '../src/app.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Attempting to insert user:', { email, role });
    const [user] = await db.insert(users).values({ email, password: hashedPassword, role }).returning();
    console.log('User inserted:', user);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505' && error.constraint === 'users_email_unique') {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "An error occurred during registration" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "User logged in",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

export default authRouter;