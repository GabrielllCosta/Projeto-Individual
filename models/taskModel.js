const db = require('../config/db');

class TaskModel {
    // Criar uma nova tarefa
    static async createTask(taskData) {
        try {
            const { title, description, due_date, user_id, category_id, priority = 'média' } = taskData;
            const query = `
                INSERT INTO tasks (
                    title, description, due_date, user_id, category_id, 
                    status, priority, created_at, updated_at
                )
                VALUES (
                    $1, $2, $3, $4, $5, 
                    'pendente', $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
                RETURNING *
            `;
            const values = [title, description, due_date, user_id, category_id, priority];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar tarefa: ${error.message}`);
        }
    }

    // Buscar tarefa por ID com detalhes
    static async getTaskById(taskId, userId) {
        try {
            const query = `
                SELECT 
                    t.*,
                    c.name as category_name,
                    CASE 
                        WHEN t.due_date < CURRENT_DATE AND t.status != 'concluída' THEN true 
                        ELSE false 
                    END as is_overdue,
                    CASE
                        WHEN t.due_date = CURRENT_DATE THEN 'hoje'
                        WHEN t.due_date = CURRENT_DATE + interval '1 day' THEN 'amanhã'
                        WHEN t.due_date < CURRENT_DATE THEN 'atrasada'
                        ELSE 'futura'
                    END as due_status
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = $1 AND t.user_id = $2
            `;
            const result = await db.query(query, [taskId, userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar tarefa: ${error.message}`);
        }
    }

    // Listar tarefas do usuário com filtros avançados
    static async getUserTasks(userId, filters = {}) {
        try {
            let query = `
                SELECT 
                    t.*,
                    c.name as category_name,
                    CASE 
                        WHEN t.due_date < CURRENT_DATE AND t.status != 'concluída' THEN true 
                        ELSE false 
                    END as is_overdue,
                    CASE
                        WHEN t.due_date = CURRENT_DATE THEN 'hoje'
                        WHEN t.due_date = CURRENT_DATE + interval '1 day' THEN 'amanhã'
                        WHEN t.due_date < CURRENT_DATE THEN 'atrasada'
                        ELSE 'futura'
                    END as due_status
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1
            `;
            const values = [userId];
            let paramCount = 1;

            // Filtros
            if (filters.status) {
                paramCount++;
                query += ` AND t.status = $${paramCount}`;
                values.push(filters.status);
            }

            if (filters.category_id) {
                paramCount++;
                query += ` AND t.category_id = $${paramCount}`;
                values.push(filters.category_id);
            }

            if (filters.priority) {
                paramCount++;
                query += ` AND t.priority = $${paramCount}`;
                values.push(filters.priority);
            }

            if (filters.due_date) {
                paramCount++;
                query += ` AND DATE(t.due_date) = $${paramCount}`;
                values.push(filters.due_date);
            }

            if (filters.search) {
                paramCount++;
                query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
                values.push(`%${filters.search}%`);
            }

            // Ordenação
            const orderBy = filters.order_by || 'due_date';
            const orderDir = filters.order_dir || 'ASC';
            query += ` ORDER BY t.${orderBy} ${orderDir}`;

            // Paginação
            if (filters.limit) {
                paramCount++;
                query += ` LIMIT $${paramCount}`;
                values.push(filters.limit);

                if (filters.offset) {
                    paramCount++;
                    query += ` OFFSET $${paramCount}`;
                    values.push(filters.offset);
                }
            }

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao listar tarefas: ${error.message}`);
        }
    }

    // Atualizar tarefa
    static async updateTask(taskId, userId, taskData) {
        try {
            const allowedUpdates = [
                'title', 'description', 'due_date', 
                'status', 'category_id', 'priority'
            ];
            
            let query = 'UPDATE tasks SET updated_at = CURRENT_TIMESTAMP';
            const values = [];
            let paramCount = 0;

            for (const [key, value] of Object.entries(taskData)) {
                if (allowedUpdates.includes(key) && value !== undefined) {
                    paramCount++;
                    query += `, ${key} = $${paramCount}`;
                    values.push(value);
                }
            }

            paramCount++;
            query += ` WHERE id = $${paramCount}`;
            values.push(taskId);

            paramCount++;
            query += ` AND user_id = $${paramCount}`;
            values.push(userId);

            query += ' RETURNING *';

            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
        }
    }

    // Deletar tarefa
    static async deleteTask(taskId, userId) {
        try {
            const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
            const result = await db.query(query, [taskId, userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao deletar tarefa: ${error.message}`);
        }
    }

    // Atualizar status da tarefa
    static async updateTaskStatus(taskId, userId, status) {
        try {
            const query = `
                UPDATE tasks 
                SET status = $1
                WHERE id = $2 AND user_id = $3
                RETURNING *
            `;
            const result = await db.query(query, [status, taskId, userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar status da tarefa: ${error.message}`);
        }
    }

    // Buscar tarefas próximas do prazo
    static async getUpcomingTasks(userId, daysThreshold = 7) {
        try {
            const query = `
                SELECT 
                    t.*,
                    c.name as category_name,
                    CASE
                        WHEN t.due_date = CURRENT_DATE THEN 'hoje'
                        WHEN t.due_date = CURRENT_DATE + interval '1 day' THEN 'amanhã'
                        ELSE to_char(t.due_date, 'DD/MM/YYYY')
                    END as due_date_formatted
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1 
                AND t.status != 'concluída'
                AND t.due_date <= CURRENT_DATE + interval '${daysThreshold} days'
                ORDER BY t.due_date ASC
            `;
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar tarefas próximas: ${error.message}`);
        }
    }

    // Buscar tarefas atrasadas
    static async getOverdueTasks(userId) {
        try {
            const query = `
                SELECT 
                    t.*,
                    c.name as category_name,
                    EXTRACT(DAY FROM CURRENT_DATE - t.due_date) as days_overdue
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1 
                AND t.status != 'concluída'
                AND t.due_date < CURRENT_DATE
                ORDER BY t.due_date ASC
            `;
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar tarefas atrasadas: ${error.message}`);
        }
    }

    // Buscar estatísticas de conclusão por período
    static async getCompletionStats(userId, startDate, endDate) {
        try {
            const query = `
                SELECT 
                    DATE_TRUNC('day', updated_at) as date,
                    COUNT(*) as total_completed
                FROM tasks
                WHERE user_id = $1 
                AND status = 'concluída'
                AND updated_at BETWEEN $2 AND $3
                GROUP BY DATE_TRUNC('day', updated_at)
                ORDER BY date
            `;
            const result = await db.query(query, [userId, startDate, endDate]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas de conclusão: ${error.message}`);
        }
    }

    // Buscar sugestões de priorização
    static async getTaskPrioritySuggestions(userId) {
        try {
            const query = `
                SELECT 
                    t.*,
                    c.name as category_name,
                    CASE
                        WHEN t.due_date < CURRENT_DATE THEN 3
                        WHEN t.due_date = CURRENT_DATE THEN 2
                        WHEN t.due_date = CURRENT_DATE + interval '1 day' THEN 1
                        ELSE 0
                    END as urgency_score
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1 
                AND t.status != 'concluída'
                ORDER BY urgency_score DESC, t.priority DESC, t.due_date ASC
                LIMIT 5
            `;
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar sugestões de priorização: ${error.message}`);
        }
    }

    // Buscar resumo diário
    static async getDailySummary(userId) {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM tasks 
                     WHERE user_id = $1 AND status != 'concluída' 
                     AND due_date = CURRENT_DATE) as due_today,
                    
                    (SELECT COUNT(*) FROM tasks 
                     WHERE user_id = $1 AND status = 'concluída' 
                     AND DATE(updated_at) = CURRENT_DATE) as completed_today,
                    
                    (SELECT COUNT(*) FROM tasks 
                     WHERE user_id = $1 AND status != 'concluída' 
                     AND due_date < CURRENT_DATE) as overdue,
                    
                    (SELECT json_agg(json_build_object(
                        'id', id,
                        'title', title,
                        'priority', priority
                    ))
                     FROM (
                         SELECT id, title, priority 
                         FROM tasks 
                         WHERE user_id = $1 
                         AND status != 'concluída'
                         AND due_date = CURRENT_DATE
                         ORDER BY priority DESC
                         LIMIT 3
                     ) t) as top_priorities
            `;
            const result = await db.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar resumo diário: ${error.message}`);
        }
    }

    // Buscar estatísticas de tarefas por categoria
    static async getTaskStatsByCategory(userId) {
        try {
            const query = `
                SELECT 
                    c.name as category_name,
                    COUNT(*) as total_tasks,
                    COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as completed_tasks
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1
                GROUP BY c.name
            `;
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas por categoria: ${error.message}`);
        }
    }
}

module.exports = TaskModel;
