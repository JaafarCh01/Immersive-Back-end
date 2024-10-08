import express from 'express';
import authRouter from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../drizzle/schema.js';
import { eq, gte, like, or, sql } from 'drizzle-orm';
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

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

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
app.use('/api/student', studentRouter);

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
    console.log('Received course data:', req.body);
    const { title, description, image, category, difficulty, duration, rating, modelUrl } = req.body;
    const [course] = await db.insert(courses).values({
      title,
      description,
      image,
      category,
      difficulty,
      duration: parseFloat(duration) || 0,
      rating: parseFloat(rating) || 0,
      modelUrl
    }).returning();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const { category, difficulty, rating, search, page = 1 } = req.query;
    const pageSize = 6; // Number of courses per page
    console.log('Received filters:', { category, difficulty, rating, search, page });

    let query = db.select().from(courses);

    if (category) query = query.where(eq(courses.category, category));
    if (difficulty) query = query.where(eq(courses.difficulty, difficulty));
    if (rating) query = query.where(gte(courses.rating, parseFloat(rating)));
    if (search) {
      query = query.where(
        or(
          like(courses.title, `%${search}%`),
          like(courses.description, `%${search}%`)
        )
      );
    }

    const totalCoursesQuery = db.select({ count: sql`count(*)` }).from(courses);
    const [{ count }] = await totalCoursesQuery;
    const totalPages = Math.ceil(count / pageSize);

    const coursesQuery = query
      .limit(pageSize)
      .offset((parseInt(page) - 1) * pageSize);

    const fetchedCourses = await coursesQuery;

    console.log('Filtered courses:', fetchedCourses);

    res.json({
      courses: fetchedCourses,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack 
    });
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