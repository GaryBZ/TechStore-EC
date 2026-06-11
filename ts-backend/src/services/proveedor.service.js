import ProveedorModel from '../models/proveedor.model.js';

export const getAllProveedores = () => ProveedorModel.getAll();

export const getProveedorById = async (id) => {
  const p = await ProveedorModel.getById(id);
  if (!p) throw new Error('Proveedor no encontrado');
  return p;
};

export const createProveedor = (data) => ProveedorModel.create(data);
export const updateProveedor = async (id, data) => {
  const p = await ProveedorModel.update(id, data);
  if (!p) throw new Error('Proveedor no encontrado');
  return p;
};

export const deleteProveedor = async (id) => {
  const p = await ProveedorModel.remove(id);
  if (!p) throw new Error('Proveedor no encontrado');
  return p;
};