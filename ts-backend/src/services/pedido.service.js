import PedidoModel from '../models/pedido.model.js';

export const getAllPedidos = () => PedidoModel.getAll();

export const getPedidoById = async (id) => {
  const p = await PedidoModel.getById(id);
  if (!p) throw new Error('Pedido no encontrado');
  return p;
};

export const getPedidosByCliente = (cli_id) => PedidoModel.getByCliente(cli_id);

export const createPedido = (data) => PedidoModel.create(data);

export const updatePedido = async (id, data) => {
  const p = await PedidoModel.update(id, data);
  if (!p) throw new Error('Pedido no encontrado');
  return p;
};

export const deletePedido = async (id) => {
  const p = await PedidoModel.remove(id);
  if (!p) throw new Error('Pedido no encontrado');
  return p;
};