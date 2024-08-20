import { supabase } from '../src/app.js';

class Course {
  constructor({ id, title, description }) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  static async create({ title, description }) {
    const { data, error } = await supabase
      .from('courses')
      .insert({ title, description })
      .select()
      .single();

    if (error) throw error;
    return new Course(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Course(data) : null;
  }

  async update({ title, description }) {
    const { data, error } = await supabase
      .from('courses')
      .update({ title, description })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  async getLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', this.id);

    if (error) throw error;
    return data;
  }

  async getStudents() {
    const { data, error } = await supabase
      .from('user_courses')
      .select('user_id')
      .eq('course_id', this.id);

    if (error) throw error;
    return data.map(item => item.user_id);
  }

  async addLesson(lessonId) {
    const { error } = await supabase
      .from('lessons')
      .update({ course_id: this.id })
      .eq('id', lessonId);

    if (error) throw error;
  }

  async removeLesson(lessonId) {
    const { error } = await supabase
      .from('lessons')
      .update({ course_id: null })
      .eq('id', lessonId)
      .eq('course_id', this.id);

    if (error) throw error;
  }
}

export default Course;