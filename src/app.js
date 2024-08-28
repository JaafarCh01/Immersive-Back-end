import express from 'express';
import authRouter from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../drizzle/schema.js';
import { eq, gte, like, or } from 'drizzle-orm';
import { courses } from '../drizzle/schema.js';

import studentRouter from '../routes/studentRouter.js';

import adminRouter from '../routes/adminRouter.js';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Remove the $connect() call
console.log('Database connection established');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/avatar', (req, res) => {
  const { name = 'User', color = 'FFFFFF', background = '000000' } = req.query;

  const encodedName = encodeURIComponent(name);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&color=${color}&background=${background}`;

  res.json({ avatarUrl });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

import teacherRouter from '../routes/teacherRouter.js';

app.use('/api/teacher', teacherRouter);

app.use("/api/v1/auth", authRouter);

app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await db
      .from('test_table')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({ 
      message: 'Connected to Supabase successfully', 
      data: data.length > 0 ? 'Data retrieved' : 'No data found'
    });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    res.status(500).json({ message: 'Failed to connect to Supabase', error: error.message });
  }
});

// Use the studentRouter
app.use('/student', studentRouter);

app.use('/api/admin', adminRouter);

app.get('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db.select().from(courses).where(eq(courses.id, parseInt(id))).limit(1);

    if (course.length > 0) {
      res.json(course[0]);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log('Received course data:', { title, description });
    const course = await db
      .insert('courses')
      .values({ title, description })
      .returning();
    console.log('Created course:', course);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack,
      supabaseError: error.supabaseError || 'No Supabase error details available'
    });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const { category, difficulty, rating, search, page = 1 } = req.query;
    const pageSize = 6; // Number of courses per page
    console.log('Received filters:', { category, difficulty, rating, search, page });

    let query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / pageSize);

    const courses = await Course.find(query)
      .skip((parseInt(page) - 1) * pageSize)
      .limit(pageSize);

    console.log('Filtered courses:', courses);

    res.json({
      courses,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { app as default, db };