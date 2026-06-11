import InventarioModel from '../models/inventario.model.js';

export const getAllInventario = () => InventarioModel.getAll();

export const getInventarioById = async (id) => {
  const i = await InventarioModel.getById(id);
  if (!i) throw new Error('Registro de inventario no encontrado');
  return i;
};

export const getInventarioByProducto = async (prd_id) => {
  const i = await InventarioModel.getByProducto(prd_id);
  if (!i) throw new Error('Inventario del producto no encontrado');
  return i;
};

export const createInventario = (data) => InventarioModel.create(data);

export const updateInventario = async (id, data) => {
  const i = await InventarioModel.update(id, data);
  if (!i) throw new Error('Registro de inventario no encontrado');
  return i;
};

export const deleteInventario = async (id) => {
  const i = await InventarioModel.remove(id);
  if (!i) throw new Error('Registro de inventario no encontrado');
  return i;
};