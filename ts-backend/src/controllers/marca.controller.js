import * as MarcaService from '../services/marca.service.js';

export const getAll = async (req, res) => {
  try {
    const data = await MarcaService.getAllMarcas();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await MarcaService.getMarcaById(req.params.id);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await MarcaService.createMarca(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await MarcaService.updateMarca(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await MarcaService.deleteMarca(req.params.id);
    res.json({ ok: true, message: 'Marca eliminada correctamente' });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};