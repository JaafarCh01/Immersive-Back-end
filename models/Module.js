// models/Module.js
import { supabase } from '../src/app.js';
import Course from './Course.js';

class Module {
  constructor({ id, title, description, course_id }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.course_id = course_id;
  }

  static async create({ title, description, course_id }) {
    const { data, error } = await supabase
      .from('modules')
      .insert({ title, description, course_id })
      .select()
      .single();

    if (error) throw error;
    return new Module(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Module(data) : null;
  }

  static async findByCourse(courseId) {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId);

    if (error) throw error;
    return data.map(module => new Module(module));
  }

  async update({ title, description }) {
    const { data, error } = await supabase
      .from('modules')
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
      .from('modules')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  async getLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', this.id);

    if (error) throw error;
    return data;
  }

  async addLesson(lessonId) {
    const { error } = await supabase
      .from('lessons')
      .update({ module_id: this.id })
      .eq('id', lessonId);

    if (error) throw error;
  }

  async removeLesson(lessonId) {
    const { error } = await supabase
      .from('lessons')
      .update({ module_id: null })
      .eq('id', lessonId)
      .eq('module_id', this.id);

    if (error) throw error;
  }

  async getCourse() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', this.course_id)
      .single();

    if (error) throw error;
    return data ? new Course(data) : null;
  }
}

export default Module;