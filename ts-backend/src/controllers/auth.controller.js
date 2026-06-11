import * as AuthService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const data = await AuthService.login(req.body);
    res.json({ ok: true, data });
  } catch (e) {
    const status = e.message === 'Usuario no encontrado' ? 404
      : e.message === 'Credenciales inválidas' ? 401
      : 400;
    res.status(status).json({ ok: false, message: e.message });
  }
};