import ClienteModel from "../models/cliente.model.js";

export const getAllClientes = () => ClienteModel.getAll();

export const getClienteById = async (id) => {
  const c = await ClienteModel.getById(id);
  if (!c) throw new Error("Cliente no encontrado");
  return c;
};

export const createCliente = (data) => ClienteModel.create(data);
export const updateCliente = async (id, data) => {
  const c = await ClienteModel.update(id, data);
  if (!c) throw new Error("Cliente no encontrado");
  return c;
};

export const deleteCliente = async (id) => {
  const c = await ClienteModel.remove(id);
  if (!c) throw new Error("Cliente no encontrado");
  return c;
};
