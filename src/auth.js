import express from "express";

import { supabase } from "./app.js";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return res.status(201).json({
      message: "User created",
      user: data.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const accessToken = jwt.sign(
      { id: data.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User logged in",
      accessToken: accessToken,
      user: data.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

authRouter.get("/profile", async (req, res) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

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