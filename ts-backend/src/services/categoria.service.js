import CategoriaModel from '../models/categoria.model.js';

export const getAllCategorias = async () => {
  return await CategoriaModel.getAll();
};

export const getCategoriaById = async (id) => {
  const categoria = await CategoriaModel.getById(id);
  if (!categoria) throw new Error('Categoría no encontrada');
  return categoria;
};

export const createCategoria = async (data) => {
  return await CategoriaModel.create(data);
};

export const updateCategoria = async (id, data) => {
  const categoria = await CategoriaModel.update(id, data);
  if (!categoria) throw new Error('Categoría no encontrada');
  return categoria;
};

export const deleteCategoria = async (id) => {
  const categoria = await CategoriaModel.remove(id);
  if (!categoria) throw new Error('Categoría no encontrada');
  return categoria;
};