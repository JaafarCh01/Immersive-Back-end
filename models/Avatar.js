import { supabase } from '../src/app.js';

class Avatar {
  constructor({ id, image_path, user_id }) {
    this.id = id;
    this.image_path = image_path;
    this.user_id = user_id;
  }

  static async create({ image_path, user_id }) {
    const { data, error } = await supabase
      .from('avatars')
      .insert({ image_path, user_id })
      .select()
      .single();

    if (error) throw error;
    return new Avatar(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? new Avatar(data) : null;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data ? new Avatar(data) : null;
  }

  async update({ image_path }) {
    const { data, error } = await supabase
      .from('avatars')
      .update({ image_path })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from('avatars')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }
}

export default Avatar;