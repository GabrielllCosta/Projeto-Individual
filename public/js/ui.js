import TaskService from './taskService.js';
import CategoryService from './categoryService.js';

// Gerenciamento de estados de loading
function setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Sistema de notificações
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Atualizar lista de tarefas
function updateTaskList(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(task => `
        <div class="task-card ${task.status}" data-id="${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-meta">
                <span class="category">${task.category_name}</span>
                <span class="due-date">${formatDate(task.due_date)}</span>
            </div>
            <div class="task-actions">
                <button onclick="completeTask(${task.id})">Concluir</button>
                <button onclick="editTask(${task.id})">Editar</button>
                <button onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    setLoading('taskList', true);
    try {
        const [tasks, categories] = await Promise.all([
            TaskService.fetchTasks(),
            CategoryService.fetchCategories()
        ]);
        
        updateTaskList(tasks);
        updateCategoryFilters(categories);
    } catch (error) {
        showNotification('Erro ao carregar dados', 'error');
    } finally {
        setLoading('taskList', false);
    }
});

// Formulário de criação de tarefa
const taskForm = document.getElementById('taskForm');
if (taskForm) {
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        setLoading('submitButton', true);
        
        const formData = new FormData(taskForm);
        const taskData = Object.fromEntries(formData.entries());
        
        try {
            const newTask = await TaskService.createTask(taskData);
            taskForm.reset();
            showNotification('Tarefa criada com sucesso');
            
            const tasks = await TaskService.fetchTasks();
            updateTaskList(tasks);
        } catch (error) {
            showNotification('Erro ao criar tarefa', 'error');
        } finally {
            setLoading('submitButton', false);
        }
    });
}

// Busca e filtros
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        setLoading('taskList', true);
        
        try {
            const tasks = await TaskService.searchTasks(searchTerm);
            updateTaskList(tasks);
        } catch (error) {
            showNotification('Erro na busca', 'error');
        } finally {
            setLoading('taskList', false);
        }
    }, 300));
}

// Funções auxiliares
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Exportar funções para uso global
window.completeTask = async (taskId) => {
    try {
        await TaskService.updateTaskStatus(taskId, 'concluída');
        showNotification('Tarefa concluída com sucesso');
        const tasks = await TaskService.fetchTasks();
        updateTaskList(tasks);
    } catch (error) {
        showNotification('Erro ao concluir tarefa', 'error');
    }
};

window.editTask = (taskId) => {
    // Implementar lógica de edição
};

window.deleteTask = async (taskId) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            await TaskService.deleteTask(taskId);
            showNotification('Tarefa excluída com sucesso');
            const tasks = await TaskService.fetchTasks();
            updateTaskList(tasks);
        } catch (error) {
            showNotification('Erro ao excluir tarefa', 'error');
        }
    }
}; 