import { supabase } from '../src/app.js';

class Test {
  constructor({ id, title, course_id }) {
    this.id = id;
    this.title = title;
    this.course_id = course_id;
  }

  static async create({ title, course_id }) {
    const { data, error } = await supabase
      .from('tests')
      .insert({ title, course_id })
      .select()
      .single();

    if (error) throw error;
    return new Test(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Test(data) : null;
  }

  async update({ title }) {
    const { data, error } = await supabase
      .from('tests')
      .update({ title })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  async addResult(userId, score) {
    const { error } = await supabase
      .from('test_results')
      .insert({ test_id: this.id, user_id: userId, score });

    if (error) throw error;
  }

  async getResults() {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('test_id', this.id);

    if (error) throw error;
    return data;
  }
}

export default Test;