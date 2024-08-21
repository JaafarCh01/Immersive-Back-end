import { supabase } from '../src/app.js';

class Quiz {
  constructor({ id, title, lesson_id, questions }) {
    this.id = id;
    this.title = title;
    this.lesson_id = lesson_id;
    this.questions = questions;
  }

  static async create({ title, lesson_id, questions }) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({ title, lesson_id, questions })
      .select()
      .single();

    if (error) throw error;
    return new Quiz(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Quiz(data) : null;
  }

  async update({ title, questions }) {
    const { data, error } = await supabase
      .from('quizzes')
      .update({ title, questions })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }
}

export default Quiz;
