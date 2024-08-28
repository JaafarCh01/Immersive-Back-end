import { pgTable, serial, text, timestamp, integer, boolean, json, foreignKey, numeric } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  category: text('category'),
  difficulty: text('difficulty'),
  rating: numeric('rating'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  courseId: integer('course_id').notNull().references(() => courses.id),
  moduleId: integer('module_id')
});

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  courseId: integer('course_id').notNull().references(() => courses.id)
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('student')
});

export const studentProgress = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  courseId: integer('course_id').notNull().references(() => courses.id),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  completed: boolean('completed').default(false),
  quizScore: integer('quiz_score')
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  questions: json('questions').notNull()
});

export const tests = pgTable('tests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  courseId: integer('course_id').notNull().references(() => courses.id)
});

export const testResults = pgTable('test_results', {
  id: serial('id').primaryKey(),
  testId: integer('test_id').notNull().references(() => tests.id),
  userId: integer('user_id').notNull().references(() => users.id),
  score: integer('score').notNull()
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  type: text('type').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
