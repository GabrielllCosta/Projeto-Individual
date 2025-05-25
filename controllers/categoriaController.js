const Category = require('../models/categorieModel');

const getAllCategorias = async (req, res) => {
  try {
    const categorias = await Category.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Category.getById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategoria = async (req, res) => {
  try {
    const newCategoria = await Category.create(req.body);
    res.status(201).json(newCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const updatedCategoria = await Category.update(req.params.id, req.body);
    if (!updatedCategoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(updatedCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
