const db = require('../config/db');

class Task {
  static async getAll() {
    const result = await db.query('SELECT * FROM tarefas');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO tarefas (title, description, due_date, status, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.title, data.description, data.due_date, data.status, data.user_id, data.category_id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE tarefas SET title = $1, description = $2, due_date = $3, status = $4, user_id = $5, category_id = $6 WHERE id = $7 RETURNING *',
      [data.title, data.description, data.due_date, data.status, data.user_id, data.category_id, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Task;
