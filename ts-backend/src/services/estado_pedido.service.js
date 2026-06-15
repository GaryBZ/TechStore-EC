import EstadoPedidoModel from '../models/estado_pedido.model.js';

export const getAllEstados = () => EstadoPedidoModel.getAll();

export const getEstadoById = async (id) => {
  const e = await EstadoPedidoModel.getById(id);
  if (!e) throw new Error('Estado de pedido no encontrado');
  return e;
};

export const createEstado = (data) => EstadoPedidoModel.create(data);

export const updateEstado = async (id, data) => {
  const e = await EstadoPedidoModel.update(id, data);
  if (!e) throw new Error('Estado de pedido no encontrado');
  return e;
};

export const deleteEstado = async (id) => {
  const e = await EstadoPedidoModel.remove(id);
  if (!e) throw new Error('Estado de pedido no encontrado');
  return e;
};
