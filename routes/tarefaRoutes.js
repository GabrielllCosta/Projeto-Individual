const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/TarefaController');


router.get('/', tarefaController.listarTarefas);
router.post('/', tarefaController.criarTarefa);
router.put('/:id', tarefaController.editarTarefa);
router.delete('/:id', tarefaController.excluirTarefa);

module.exports = router;
