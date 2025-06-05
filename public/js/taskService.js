// Serviço para gerenciamento de tarefas
const TaskService = {
    // Buscar todas as tarefas do usuário
    async fetchTasks() {
        try {
            const response = await fetch('/api/tasks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            throw error;
        }
    },

    // Criar nova tarefa
    async createTask(taskData) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            throw error;
        }
    },

    // Atualizar status da tarefa
    async updateTaskStatus(taskId, status) {
        try {
            const response = await fetch(`/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            throw error;
        }
    }
};

export default TaskService; 