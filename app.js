const express = require('express');
const path = require('path');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

app.get('/tasks', (req, res) => {
    // Dados de exemplo para teste
    const tasks = [
        {
            id: 1,
            title: 'Estudar Vocabulário',
            description: 'Revisar palavras novas da semana',
            category_id: 1,
            category_name: 'Estudo',
            due_date: new Date('2024-03-30')
        }
    ];
    res.render('tasks/index', { tasks });
});

app.get('/tasks/new', (req, res) => {
    // Dados de exemplo para teste
    const categories = [
        { id: 1, name: 'Estudo' },
        { id: 2, name: 'Revisão' },
        { id: 3, name: 'Lazer' }
    ];
    res.render('tasks/form', { task: null, categories });
});

// Processar o formulário de nova tarefa
app.post('/tasks', (req, res) => {
    const { title, description, category_id, due_date } = req.body;
    console.log('Nova tarefa:', { title, description, category_id, due_date });
    // Aqui você adicionaria a lógica para salvar no banco de dados
    res.redirect('/tasks');
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Algo deu errado!' });
});

// 404 - Página não encontrada
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});