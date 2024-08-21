import { supabase } from '../src/app.js';

class User {
  constructor({ id, username, email, role, avatar_id }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.avatar_id = avatar_id;
  }

  static async create({ username, email, password, role = 'STUDENT' }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('users')
      .insert({ id: authData.user.id, username, email, role })
      .select()
      .single();

    if (error) throw error;
    return new User(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new User(data) : null;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data ? new User(data) : null;
  }

  async update({ username, email, role }) {
    const { data, error } = await supabase
      .from('users')
      .update({ username, email, role })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  async getCourses() {
    const { data, error } = await supabase
      .from('user_courses')
      .select('course_id')
      .eq('user_id', this.id);

    if (error) throw error;
    return data.map(item => item.course_id);
  }

  async addCourse(courseId) {
    const { error } = await supabase
      .from('user_courses')
      .insert({ user_id: this.id, course_id: courseId });

    if (error) throw error;
  }

  async removeCourse(courseId) {
    const { error } = await supabase
      .from('user_courses')
      .delete()
      .eq('user_id', this.id)
      .eq('course_id', courseId);

    if (error) throw error;
  }

  async getProgress(courseId) {
    return StudentProgress.findByUserAndCourse(this.id, courseId);
  }

  async completeLesson(lessonId, courseId) {
    const existingProgress = await StudentProgress.findByUserAndCourse(this.id, courseId);
    const lessonProgress = existingProgress.find(p => p.lesson_id === lessonId);

    if (lessonProgress) {
      return await lessonProgress.update({ completed: true });
    } else {
      return await StudentProgress.create({
        user_id: this.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed: true
      });
    }
  }

  async submitQuizScore(lessonId, courseId, score) {
    const existingProgress = await StudentProgress.findByUserAndCourse(this.id, courseId);
    const lessonProgress = existingProgress.find(p => p.lesson_id === lessonId);

    if (lessonProgress) {
      return await lessonProgress.update({ quiz_score: score });
    } else {
      return await StudentProgress.create({
        user_id: this.id,
        course_id: courseId,
        lesson_id: lessonId,
        quiz_score: score
      });
    }
  }
}

export default User;
