import ProductoModel from '../models/producto.model.js';

export const getAllProductos = () => ProductoModel.getAll();
export const getProductoById = async (id) => {
  const p = await ProductoModel.getById(id);
  if (!p) throw new Error('Producto no encontrado');
  return p;
};
export const getProductosByMarca = (mar_id) => ProductoModel.getByMarca(mar_id);
export const getProductosByCategoria = (cat_id) => ProductoModel.getByCategoria(cat_id);
export const createProducto = (data) => ProductoModel.create(data);
export const updateProducto = async (id, data) => {
  const p = await ProductoModel.update(id, data);
  if (!p) throw new Error('Producto no encontrado');
  return p;
};
export const deleteProducto = async (id) => {
  const p = await ProductoModel.remove(id);
  if (!p) throw new Error('Producto no encontrado');
  return p;
};