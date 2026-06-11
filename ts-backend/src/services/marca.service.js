import MarcaModel from '../models/marca.model.js';

export const getAllMarcas = async () => {
  return await MarcaModel.getAll();
};

export const getMarcaById = async (id) => {
  const marca = await MarcaModel.getById(id);
  if (!marca) throw new Error('Marca no encontrada');
  return marca;
};

export const createMarca = async (data) => {
  return await MarcaModel.create(data);
};

export const updateMarca = async (id, data) => {
  const marca = await MarcaModel.update(id, data);
  if (!marca) throw new Error('Marca no encontrada');
  return marca;
};

export const deleteMarca = async (id) => {
  const marca = await MarcaModel.remove(id);
  if (!marca) throw new Error('Marca no encontrada');
  return marca;
};