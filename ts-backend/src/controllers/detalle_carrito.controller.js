import * as S from '../services/detalle_carrito.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllDetallesCarrito() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getDetalleCarritoById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const getByCarrito = async (req, res) => {
  try { res.json({ ok: true, data: await S.getDetallesByCarrito(req.params.car_id) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createDetalleCarrito(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateDetalleCarrito(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteDetalleCarrito(req.params.id); res.json({ ok: true, message: 'Detalle de carrito eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
