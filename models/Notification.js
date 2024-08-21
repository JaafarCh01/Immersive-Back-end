import { supabase } from '../src/app.js';

class Notification {
  constructor({ id, user_id, message, type, read, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.message = message;
    this.type = type;
    this.read = read;
    this.created_at = created_at;
  }

  static async create({ user_id, message, type }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id, message, type, read: false })
      .select()
      .single();

    if (error) throw error;
    return new Notification(data);
  }

  static async findByUser(user_id) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(notification => new Notification(notification));
  }

  async markAsRead() {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }
}

export default Notification;
