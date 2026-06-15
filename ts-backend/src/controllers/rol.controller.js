import * as S from '../services/rol.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllRoles() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getRolById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createRol(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateRol(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteRol(req.params.id); res.json({ ok: true, message: 'Rol eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};