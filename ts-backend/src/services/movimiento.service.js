import MovimientoModel from '../models/movimiento.model.js';

export const getAllMovimientos = () => MovimientoModel.getAll();

export const getMovimientoById = async (id) => {
  const m = await MovimientoModel.getById(id);
  if (!m) throw new Error('Movimiento no encontrado');
  return m;
};

export const getMovimientosByProducto = (prd_id) => MovimientoModel.getByProducto(prd_id);

export const createMovimiento = (data) => MovimientoModel.create(data);

export const updateMovimiento = async (id, data) => {
  const m = await MovimientoModel.update(id, data);
  if (!m) throw new Error('Movimiento no encontrado');
  return m;
};

export const deleteMovimiento = async (id) => {
  const m = await MovimientoModel.remove(id);
  if (!m) throw new Error('Movimiento no encontrado');
  return m;
};