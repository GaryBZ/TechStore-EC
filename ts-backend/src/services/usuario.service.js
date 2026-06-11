import UsuarioModel from '../models/usuario.model.js';

export const getAllUsuarios = () => UsuarioModel.getAll();

export const getUsuarioById = async (id) => {
  const u = await UsuarioModel.getById(id);
  if (!u) throw new Error('Usuario no encontrado');
  return u;
};

export const getUsuariosByRol = (rol_id) => UsuarioModel.getByRol(rol_id);

export const createUsuario = (data) => UsuarioModel.create(data);

export const updateUsuario = async (id, data) => {
  const u = await UsuarioModel.update(id, data);
  if (!u) throw new Error('Usuario no encontrado');
  return u;
};

export const deleteUsuario = async (id) => {
  const u = await UsuarioModel.remove(id);
  if (!u) throw new Error('Usuario no encontrado');
  return u;
};