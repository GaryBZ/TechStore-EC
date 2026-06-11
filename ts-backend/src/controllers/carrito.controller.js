import * as S from '../services/carrito.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await S.getAllCarritos();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await S.getCarritoById(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const getByCliente = async (req, res) => {
  try {
    const data = await S.getCarritosByCliente(req.params.cli_id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await S.createCarrito(req.body);
    res.status(201).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await S.updateCarrito(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    await S.deleteCarrito(req.params.id);
    res.json({ ok: true, message: 'Carrito eliminado correctamente' });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};