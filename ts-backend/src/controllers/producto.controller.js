import * as S from '../services/producto.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllProductos() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getProductoById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const getByMarca = async (req, res) => {
  try { res.json({ ok: true, data: await S.getProductosByMarca(req.params.mar_id) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getByCategoria = async (req, res) => {
  try { res.json({ ok: true, data: await S.getProductosByCategoria(req.params.cat_id) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createProducto(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateProducto(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteProducto(req.params.id); res.json({ ok: true, message: 'Producto eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};