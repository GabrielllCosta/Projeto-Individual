const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Listar todas as tarefas
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.all(`
            SELECT t.*, c.name as category_name 
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            ORDER BY t.due_date ASC
        `);
        res.render('tasks/index', { tasks });
    } catch (error) {
        res.status(500).render('error', { message: 'Erro ao buscar tarefas' });
    }
});

// Formulário de nova tarefa
router.get('/tasks/new', async (req, res) => {
    try {
        const categories = await db.all('SELECT * FROM categories');
        res.render('tasks/form', { task: null, categories });
    } catch (error) {
        res.status(500).render('error', { message: 'Erro ao carregar formulário' });
    }
});

// Formulário de edição de tarefa
router.get('/tasks/:id/edit', async (req, res) => {
    const { id } = req.params;
    
    try {
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        const categories = await db.all('SELECT * FROM categories');
        
        if (!task) {
            return res.status(404).render('error', { message: 'Tarefa não encontrada' });
        }
        
        res.render('tasks/form', { task, categories });
    } catch (error) {
        res.status(500).render('error', { message: 'Erro ao carregar formulário' });
    }
});

module.exports = router; 