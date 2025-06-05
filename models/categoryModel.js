const db = require('../config/db');

class CategoryModel {
    // Criar uma nova categoria
    static async createCategory(name, description = null, userId = null) {
        try {
            const query = `
                INSERT INTO categories (name, description, user_id, created_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING *
            `;
            const result = await db.query(query, [name, description, userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar categoria: ${error.message}`);
        }
    }

    // Buscar todas as categorias com estatísticas
    static async getAllCategories(userId = null) {
        try {
            let query = `
                SELECT 
                    c.*,
                    COUNT(t.id) as total_tasks,
                    COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN t.status = 'pendente' THEN 1 END) as pending_tasks,
                    ROUND(COUNT(CASE WHEN t.status = 'concluída' THEN 1 END)::numeric / 
                          NULLIF(COUNT(t.id), 0) * 100, 2) as completion_rate,
                    MAX(t.updated_at) as last_activity
                FROM categories c
                LEFT JOIN tasks t ON c.id = t.category_id
            `;

            const values = [];
            if (userId) {
                query += ` WHERE (c.user_id = $1 OR c.user_id IS NULL)`;
                values.push(userId);
            }

            query += `
                GROUP BY c.id
                ORDER BY c.name
            `;

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar categorias: ${error.message}`);
        }
    }

    // Buscar categoria por ID com estatísticas detalhadas
    static async getCategoryById(id, userId = null) {
        try {
            const query = `
                SELECT 
                    c.*,
                    COUNT(t.id) as total_tasks,
                    COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN t.status = 'pendente' THEN 1 END) as pending_tasks,
                    COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'concluída' THEN 1 END) as overdue_tasks,
                    ROUND(COUNT(CASE WHEN t.status = 'concluída' THEN 1 END)::numeric / 
                          NULLIF(COUNT(t.id), 0) * 100, 2) as completion_rate,
                    MAX(t.updated_at) as last_activity,
                    (
                        SELECT json_agg(json_build_object(
                            'status', status,
                            'count', count
                        ))
                        FROM (
                            SELECT status, COUNT(*) as count
                            FROM tasks
                            WHERE category_id = c.id
                            GROUP BY status
                        ) status_counts
                    ) as status_distribution
                FROM categories c
                LEFT JOIN tasks t ON c.id = t.category_id
                WHERE c.id = $1
                ${userId ? 'AND (c.user_id = $2 OR c.user_id IS NULL)' : ''}
                GROUP BY c.id
            `;

            const values = userId ? [id, userId] : [id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar categoria: ${error.message}`);
        }
    }

    // Atualizar categoria
    static async updateCategory(id, name, description = null, userId = null) {
        try {
            const query = `
                UPDATE categories 
                SET 
                    name = $1, 
                    description = $2,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $3
                ${userId ? 'AND (user_id = $4 OR user_id IS NULL)' : ''}
                RETURNING *
            `;
            const values = userId ? [name, description, id, userId] : [name, description, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar categoria: ${error.message}`);
        }
    }

    // Deletar categoria
    static async deleteCategory(id, userId = null) {
        try {
            // Primeiro, verifica se existem tarefas associadas
            const checkQuery = `
                SELECT COUNT(*) as task_count
                FROM tasks
                WHERE category_id = $1
            `;
            const checkResult = await db.query(checkQuery, [id]);
            
            if (checkResult.rows[0].task_count > 0) {
                throw new Error('Não é possível deletar categoria com tarefas associadas');
            }

            const query = `
                DELETE FROM categories 
                WHERE id = $1
                ${userId ? 'AND (user_id = $2 OR user_id IS NULL)' : ''}
                RETURNING *
            `;
            const values = userId ? [id, userId] : [id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao deletar categoria: ${error.message}`);
        }
    }

    // Buscar categorias mais utilizadas
    static async getMostUsedCategories(userId = null, limit = 5) {
        try {
            const query = `
                SELECT 
                    c.id,
                    c.name,
                    COUNT(t.id) as task_count,
                    COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as completed_tasks,
                    ROUND(COUNT(CASE WHEN t.status = 'concluída' THEN 1 END)::numeric / 
                          NULLIF(COUNT(t.id), 0) * 100, 2) as completion_rate
                FROM categories c
                LEFT JOIN tasks t ON c.id = t.category_id
                ${userId ? 'WHERE (c.user_id = $1 OR c.user_id IS NULL)' : ''}
                GROUP BY c.id, c.name
                HAVING COUNT(t.id) > 0
                ORDER BY task_count DESC
                LIMIT $${userId ? '2' : '1'}
            `;
            const values = userId ? [userId, limit] : [limit];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar categorias mais utilizadas: ${error.message}`);
        }
    }

    // Buscar tendências de categoria
    static async getCategoryTrends(userId = null, days = 30) {
        try {
            const query = `
                WITH daily_stats AS (
                    SELECT 
                        c.id,
                        c.name,
                        DATE_TRUNC('day', t.created_at) as date,
                        COUNT(*) as tasks_created,
                        COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as tasks_completed
                    FROM categories c
                    LEFT JOIN tasks t ON c.id = t.category_id
                    WHERE t.created_at >= CURRENT_DATE - interval '${days} days'
                    ${userId ? 'AND (c.user_id = $1 OR c.user_id IS NULL)' : ''}
                    GROUP BY c.id, c.name, DATE_TRUNC('day', t.created_at)
                )
                SELECT 
                    id,
                    name,
                    SUM(tasks_created) as total_tasks_created,
                    SUM(tasks_completed) as total_tasks_completed,
                    ROUND(AVG(tasks_created), 2) as avg_daily_tasks,
                    ROUND(AVG(tasks_completed), 2) as avg_daily_completions,
                    json_agg(json_build_object(
                        'date', date,
                        'tasks_created', tasks_created,
                        'tasks_completed', tasks_completed
                    ) ORDER BY date) as daily_data
                FROM daily_stats
                GROUP BY id, name
                ORDER BY total_tasks_created DESC
            `;
            const values = userId ? [userId] : [];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar tendências de categoria: ${error.message}`);
        }
    }

    // Buscar sugestões de categoria baseadas em padrões
    static async getCategorySuggestions(taskTitle, userId = null) {
        try {
            const query = `
                WITH task_words AS (
                    SELECT unnest(string_to_array(lower($1), ' ')) as word
                ),
                category_matches AS (
                    SELECT 
                        c.id,
                        c.name,
                        COUNT(*) as match_count
                    FROM categories c
                    CROSS JOIN task_words tw
                    WHERE lower(c.name) LIKE '%' || tw.word || '%'
                    ${userId ? 'AND (c.user_id = $2 OR c.user_id IS NULL)' : ''}
                    GROUP BY c.id, c.name
                )
                SELECT 
                    id,
                    name,
                    match_count
                FROM category_matches
                ORDER BY match_count DESC, name
                LIMIT 3
            `;
            const values = userId ? [taskTitle, userId] : [taskTitle];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar sugestões de categoria: ${error.message}`);
        }
    }
}

module.exports = CategoryModel; 