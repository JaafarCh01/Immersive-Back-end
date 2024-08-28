import express from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from '../src/app.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email, password: hashedPassword }).returning();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "User logged in",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

authRouter.get("/profile", async (req, res) => {
  try {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({ userId: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

export default authRouter;