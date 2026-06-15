import DetallePedidoModel from '../models/detalle_pedido.model.js';

export const getAllDetallesPedido = () => DetallePedidoModel.getAll();

export const getDetallePedidoById = async (id) => {
  const d = await DetallePedidoModel.getById(id);
  if (!d) throw new Error('Detalle de pedido no encontrado');
  return d;
};

export const getDetallesByPedido = (ped_id) => DetallePedidoModel.getByPedido(ped_id);

export const createDetallePedido = (data) => DetallePedidoModel.create(data);

export const updateDetallePedido = async (id, data) => {
  const d = await DetallePedidoModel.update(id, data);
  if (!d) throw new Error('Detalle de pedido no encontrado');
  return d;
};

export const deleteDetallePedido = async (id) => {
  const d = await DetallePedidoModel.remove(id);
  if (!d) throw new Error('Detalle de pedido no encontrado');
  return d;
};