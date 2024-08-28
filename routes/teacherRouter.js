import express from 'express';
import { Course, Lesson, Module, Test, Quiz } from '../models/index.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const teacherRouter = express.Router();

// Middleware to check if the user is a teacher for the course
async function isTeacherForCourse(req, res, next) {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  const isTeacher = await course.isTeacher(req.user.id);
  if (!isTeacher) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  req.course = course;
  next();
}



// Create a new course
teacherRouter.post('/courses', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, difficulty, rating } = req.body;
    const course = await Course.create({ title, description, category, difficulty, rating });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a course
teacherRouter.put('/courses/:id', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const { title, description, category, difficulty, rating } = req.body;
    const updatedCourse = await req.course.update({ title, description, category, difficulty, rating });
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new module
teacherRouter.post('/courses/:courseId/modules', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const module = await Module.create({ ...req.body, course_id: req.course.id });
    res.status(201).json(module);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a module
teacherRouter.put('/courses/:courseId/modules/:moduleId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module || module.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Module not found' });
    }
    const updatedModule = await module.update(req.body);
    res.json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new lesson
teacherRouter.post('/courses/:courseId/lessons', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.create({ ...req.body, course_id: req.course.id });
    await lesson.notifyStudents(`New lesson available in ${req.course.title}: ${lesson.title}`);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a lesson
teacherRouter.put('/courses/:courseId/lessons/:lessonId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const updatedLesson = await lesson.update(req.body);
    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lesson
teacherRouter.delete('/courses/:courseId/lessons/:lessonId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    await lesson.delete();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new test
teacherRouter.post('/courses/:courseId/tests', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, course_id: req.course.id });
    await test.notifyStudents(`New test available in ${req.course.title}: ${test.title}`);
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a test
teacherRouter.put('/courses/:courseId/tests/:testId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test || test.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Test not found' });
    }
    const updatedTest = await test.update(req.body);
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a test
teacherRouter.delete('/courses/:courseId/tests/:testId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test || test.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Test not found' });
    }
    await test.delete();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new quiz
teacherRouter.post('/courses/:courseId/lessons/:lessonId/quizzes', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const quiz = await Quiz.create({ ...req.body, lesson_id: lesson.id });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a quiz
teacherRouter.put('/courses/:courseId/lessons/:lessonId/quizzes/:quizId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz || quiz.lesson_id !== lesson.id) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const updatedQuiz = await quiz.update(req.body);
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a quiz
teacherRouter.delete('/courses/:courseId/lessons/:lessonId/quizzes/:quizId', authMiddleware, isTeacherForCourse, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || lesson.course_id !== req.course.id) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz || quiz.lesson_id !== lesson.id) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    await quiz.delete();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default teacherRouter;