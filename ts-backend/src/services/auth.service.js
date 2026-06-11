import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/auth.model.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.usu_id,
      email: user.usu_cor,
      rol_id: user.rol_id,
      rol_nom: user.rol_nom,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async ({ usu_nom, usu_ape, usu_cor, password, usu_tel, rol_id }) => {
  if (!usu_cor || !password) throw new Error('Datos incompletos');

  const hash = await bcrypt.hash(password, 10);

  await UsuarioModel.create({
    usu_nom, usu_ape, usu_cor, usu_pas: hash, usu_tel, rol_id
  });
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email y contraseña requeridos');
  }

  const user = await AuthModel.getByEmail(email.trim().toLowerCase());
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.usu_est !== 'A') {
    throw new Error('Usuario inactivo');
  }

  const isValid = await bcrypt.compare(password, user.usu_pas);
  if (!isValid) {
    throw new Error('Credenciales inválidas');
  }

  const { usu_pas, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { ...safeUser, token };
};