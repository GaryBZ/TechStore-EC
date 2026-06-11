import * as S from "../services/proveedor.service.js";

export const getAll = async (req, res) => {
  try {
    res.json({ ok: true, data: await S.getAllProveedores() });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    res.json({ ok: true, data: await S.getProveedorById(req.params.id) });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    res.status(201).json({ ok: true, data: await S.createProveedor(req.body) });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    res.json({
      ok: true,
      data: await S.updateProveedor(req.params.id, req.body),
    });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    await S.deleteProveedor(req.params.id);
    res.json({ ok: true, message: "Proveedor eliminado" });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
};
