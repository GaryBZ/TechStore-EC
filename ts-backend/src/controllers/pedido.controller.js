import * as S from '../services/pedido.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await S.getAllPedidos();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await S.getPedidoById(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const getByCliente = async (req, res) => {
  try {
    const data = await S.getPedidosByCliente(req.params.cli_id);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await S.createPedido(req.body);
    res.status(201).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await S.updatePedido(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    await S.deletePedido(req.params.id);
    res.json({ ok: true, message: 'Pedido eliminado correctamente' });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};