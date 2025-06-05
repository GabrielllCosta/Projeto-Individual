const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Módulo nativo do Node.js

class UserModel {
    // Função auxiliar para hash de senha
    static #hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }

    // Função auxiliar para verificar senha
    static #verifyPassword(password, hashedPassword) {
        const [salt, hash] = hashedPassword.split(':');
        const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === verifyHash;
    }

    // Criar um novo usuário
    static async createUser(username, email, password) {
        try {
            const hashedPassword = this.#hashPassword(password);
            const query = `
                INSERT INTO users (username, email, password, created_at, last_login)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING id, username, email, created_at
            `;
            const values = [username, email, hashedPassword];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    // Buscar usuário por ID com estatísticas
    static async getUserById(id) {
        try {
            const query = `
                SELECT 
                    u.id, 
                    u.username, 
                    u.email, 
                    u.created_at,
                    u.last_login,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = u.id) as total_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND status = 'concluída') as completed_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND due_date < CURRENT_DATE AND status != 'concluída') as overdue_tasks
                FROM users u
                WHERE u.id = $1
            `;
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
    }

    // Buscar usuário por email
    static async getUserByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
        }
    }

    // Login do usuário
    static async loginUser(email, password) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await db.query(query, [email]);
            const user = result.rows[0];

            if (!user || !this.#verifyPassword(password, user.password)) {
                throw new Error('Credenciais inválidas');
            }

            // Atualiza último login
            await db.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
                [user.id]
            );

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Erro no login: ${error.message}`);
        }
    }

    // Atualizar perfil do usuário
    static async updateUser(id, userData) {
        try {
            const { username, email, password, current_password } = userData;
            
            // Verifica senha atual se fornecida
            if (current_password) {
                const currentUser = await db.query('SELECT password FROM users WHERE id = $1', [id]);
                if (!this.#verifyPassword(current_password, currentUser.rows[0].password)) {
                    throw new Error('Senha atual incorreta');
                }
            }

            let query = 'UPDATE users SET ';
            const values = [];
            let paramCount = 0;

            if (username) {
                paramCount++;
                query += `username = $${paramCount}, `;
                values.push(username);
            }

            if (email) {
                paramCount++;
                query += `email = $${paramCount}, `;
                values.push(email);
            }

            if (password) {
                paramCount++;
                query += `password = $${paramCount}, `;
                values.push(this.#hashPassword(password));
            }

            query = query.slice(0, -2); // Remove última vírgula
            paramCount++;
            query += ` WHERE id = $${paramCount} RETURNING id, username, email, created_at, last_login`;
            values.push(id);

            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    // Buscar progresso do usuário
    static async getUserProgress(userId) {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM tasks WHERE user_id = $1) as total_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = 'concluída') as completed_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = 'pendente') as pending_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND due_date < CURRENT_DATE AND status != 'concluída') as overdue_tasks,
                    (SELECT ROUND(AVG(CASE WHEN status = 'concluída' THEN 1 ELSE 0 END) * 100, 2)
                     FROM tasks WHERE user_id = $1) as completion_rate,
                    (SELECT json_agg(json_build_object(
                        'category_name', c.name,
                        'total_tasks', COUNT(t.id),
                        'completed_tasks', COUNT(CASE WHEN t.status = 'concluída' THEN 1 END)
                    ))
                     FROM tasks t
                     JOIN categories c ON t.category_id = c.id
                     WHERE t.user_id = $1
                     GROUP BY c.id) as category_stats
            `;
            const result = await db.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar progresso: ${error.message}`);
        }
    }

    // Buscar histórico de atividades do usuário
    static async getUserActivity(userId, limit = 10) {
        try {
            const query = `
                SELECT 
                    t.id,
                    t.title,
                    t.status,
                    t.due_date,
                    c.name as category_name,
                    CASE 
                        WHEN t.status = 'concluída' THEN 'Tarefa concluída'
                        WHEN t.status = 'pendente' AND t.due_date < CURRENT_DATE THEN 'Tarefa atrasada'
                        ELSE 'Tarefa em andamento'
                    END as activity_type,
                    t.updated_at as activity_date
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = $1
                ORDER BY t.updated_at DESC
                LIMIT $2
            `;
            const result = await db.query(query, [userId, limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar atividades: ${error.message}`);
        }
    }

    // Buscar ranking de usuários mais produtivos
    static async getProductivityRanking(limit = 5) {
        try {
            const query = `
                SELECT 
                    u.username,
                    COUNT(t.id) as total_tasks,
                    COUNT(CASE WHEN t.status = 'concluída' THEN 1 END) as completed_tasks,
                    ROUND(COUNT(CASE WHEN t.status = 'concluída' THEN 1 END)::numeric / 
                          NULLIF(COUNT(t.id), 0) * 100, 2) as completion_rate
                FROM users u
                LEFT JOIN tasks t ON u.id = t.user_id
                GROUP BY u.id, u.username
                HAVING COUNT(t.id) > 0
                ORDER BY completion_rate DESC
                LIMIT $1
            `;
            const result = await db.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar ranking: ${error.message}`);
        }
    }

    // Deletar usuário
    static async deleteUser(id) {
        try {
            const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao deletar usuário: ${error.message}`);
        }
    }
}

module.exports = UserModel;
