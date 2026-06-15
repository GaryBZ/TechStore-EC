import * as S from '../services/detalle_pedido.service.js';

export const getAll = async (req, res) => {
  try { res.json({ ok: true, data: await S.getAllDetallesPedido() }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const getById = async (req, res) => {
  try { res.json({ ok: true, data: await S.getDetallePedidoById(req.params.id) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const getByPedido = async (req, res) => {
  try { res.json({ ok: true, data: await S.getDetallesByPedido(req.params.ped_id) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const create = async (req, res) => {
  try { res.status(201).json({ ok: true, data: await S.createDetallePedido(req.body) }); }
  catch (e) { res.status(500).json({ ok: false, message: e.message }); }
};
export const update = async (req, res) => {
  try { res.json({ ok: true, data: await S.updateDetallePedido(req.params.id, req.body) }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};
export const remove = async (req, res) => {
  try { await S.deleteDetallePedido(req.params.id); res.json({ ok: true, message: 'Detalle de pedido eliminado' }); }
  catch (e) { res.status(404).json({ ok: false, message: e.message }); }
};