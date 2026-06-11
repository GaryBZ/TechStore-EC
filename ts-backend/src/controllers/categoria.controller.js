import * as CategoriaService from '../services/categoria.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await CategoriaService.getAllCategorias();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await CategoriaService.getCategoriaById(req.params.id);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await CategoriaService.createCategoria(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await CategoriaService.updateCategoria(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await CategoriaService.deleteCategoria(req.params.id);
    res.json({ ok: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};