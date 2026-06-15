import RolModel from '../models/rol.model.js';

export const getAllRoles = () => RolModel.getAll();

export const getRolById = async (id) => {
  const r = await RolModel.getById(id);
  if (!r) throw new Error('Rol no encontrado');
  return r;
};

export const createRol = (data) => RolModel.create(data);

export const updateRol = async (id, data) => {
  const r = await RolModel.update(id, data);
  if (!r) throw new Error('Rol no encontrado');
  return r;
};

export const deleteRol = async (id) => {
  const r = await RolModel.remove(id);
  if (!r) throw new Error('Rol no encontrado');
  return r;
};