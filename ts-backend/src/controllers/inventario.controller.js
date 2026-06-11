import * as S from '../services/inventario.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await S.getAllInventario();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await S.getInventarioById(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const getByProducto = async (req, res) => {
  try {
    const data = await S.getInventarioByProducto(req.params.prd_id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await S.createInventario(req.body);
    res.status(201).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await S.updateInventario(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    await S.deleteInventario(req.params.id);
    res.json({ ok: true, message: 'Registro de inventario eliminado' });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};