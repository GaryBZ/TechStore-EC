import DetalleCarritoModel from '../models/detalle_carrito.model.js';

export const getAllDetallesCarrito = () => DetalleCarritoModel.getAll();

export const getDetalleCarritoById = async (id) => {
  const d = await DetalleCarritoModel.getById(id);
  if (!d) throw new Error('Detalle de carrito no encontrado');
  return d;
};

export const getDetallesByCarrito = (car_id) => DetalleCarritoModel.getByCarrito(car_id);

export const createDetalleCarrito = (data) => DetalleCarritoModel.create(data);

export const updateDetalleCarrito = async (id, data) => {
  const d = await DetalleCarritoModel.update(id, data);
  if (!d) throw new Error('Detalle de carrito no encontrado');
  return d;
};

export const deleteDetalleCarrito = async (id) => {
  const d = await DetalleCarritoModel.remove(id);
  if (!d) throw new Error('Detalle de carrito no encontrado');
  return d;
};