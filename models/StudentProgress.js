import { supabase } from '../src/app.js';

class StudentProgress {
  constructor({ id, user_id, course_id, lesson_id, completed, quiz_score }) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.lesson_id = lesson_id;
    this.completed = completed;
    this.quiz_score = quiz_score;
  }

  static async create({ user_id, course_id, lesson_id, completed = false, quiz_score = null }) {
    const { data, error } = await supabase
      .from('student_progress')
      .insert({ user_id, course_id, lesson_id, completed, quiz_score })
      .select()
      .single();

    if (error) throw error;
    return new StudentProgress(data);
  }

  static async findByUserAndCourse(user_id, course_id) {
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('course_id', course_id);

    if (error) throw error;
    return data.map(progress => new StudentProgress(progress));
  }

  async update({ completed, quiz_score }) {
    const { data, error } = await supabase
      .from('student_progress')
      .update({ completed, quiz_score })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }
}

export default StudentProgress;