import { supabase } from '../src/app.js';

class Lesson {
  constructor({ id, title, content, course_id }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.course_id = course_id;
  }

  static async create({ title, content, course_id }) {
    const { data, error } = await supabase
      .from('lessons')
      .insert({ title, content, course_id })
      .select()
      .single();

    if (error) throw error;
    return new Lesson(data);
  }

  static async createForCourse(courseId, { title, content }) {
    const { data, error } = await supabase
      .from('lessons')
      .insert({ title, content, course_id: courseId })
      .select()
      .single();

    if (error) throw error;
    return new Lesson(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Lesson(data) : null;
  }

  static async findByCourse(course_id) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course_id);

    if (error) throw error;
    return data.map(lesson => new Lesson(lesson));
  }

  async update({ title, content }) {
    const { data, error } = await supabase
      .from('lessons')
      .update({ title, content })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  async getCourse() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', this.course_id)
      .single();

    if (error) throw error;
    return new Course(data);
  }
}

export default Lesson;