// Serviço para gerenciamento de categorias
const CategoryService = {
    // Buscar todas as categorias com estatísticas
    async fetchCategories() {
        try {
            const response = await fetch('/api/categories/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
    },

    // Criar nova categoria
    async createCategory(categoryData) {
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    }
};

export default CategoryService; 