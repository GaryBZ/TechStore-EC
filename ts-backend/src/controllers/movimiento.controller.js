import * as S from '../services/movimiento.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllMovimientos() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getMovimientoById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const getByProducto = async (req, res) => {
  try { res.json({ ok: true, data: await S.getMovimientosByProducto(req.params.prd_id) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createMovimiento(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateMovimiento(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteMovimiento(req.params.id); res.json({ ok: true, message: 'Movimiento eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
