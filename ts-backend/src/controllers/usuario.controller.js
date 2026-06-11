import * as S from '../services/usuario.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await S.getAllUsuarios();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await S.getUsuarioById(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const getByRol = async (req, res) => {
  try {
    const data = await S.getUsuariosByRol(req.params.rol_id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await S.createUsuario(req.body);
    res.status(201).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await S.updateUsuario(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    await S.deleteUsuario(req.params.id);
    res.json({ ok: true, message: 'Usuario eliminado correctamente' });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};