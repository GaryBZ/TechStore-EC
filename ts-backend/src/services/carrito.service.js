import CarritoModel from '../models/carrito.model.js';

export const getAllCarritos = () => CarritoModel.getAll();

export const getCarritoById = async (id) => {
  const c = await CarritoModel.getById(id);
  if (!c) throw new Error('Carrito no encontrado');
  return c;
};

export const getCarritosByCliente = (cli_id) => CarritoModel.getByCliente(cli_id);

export const createCarrito = (data) => CarritoModel.create(data);

export const updateCarrito = async (id, data) => {
  const c = await CarritoModel.update(id, data);
  if (!c) throw new Error('Carrito no encontrado');
  return c;
};

export const deleteCarrito = async (id) => {
  const c = await CarritoModel.remove(id);
  if (!c) throw new Error('Carrito no encontrado');
  return c;
};