import * as S from '../services/estado_pedido.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllEstados() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getEstadoById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createEstado(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateEstado(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteEstado(req.params.id); res.json({ ok: true, message: 'Estado eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};