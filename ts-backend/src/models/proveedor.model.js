import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const ProveedorModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PROVEEDORES_GETALL(:cursor); END;`,
        { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return await cursorToObjects(result.outBinds.cursor);
    } finally { await conn.close(); }
  },

  getById: async (id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PROVEEDORES_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ pro_emp, pro_ruc, pro_con, pro_tel, pro_cor, pro_dir, pro_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PROVEEDORES_CREATE(:emp, :ruc, :con, :tel, :cor, :dir, :est, :cursor); END;`,
        {
          emp: { val: pro_emp, type: oracledb.STRING },
          ruc: { val: pro_ruc, type: oracledb.STRING },
          con: { val: pro_con, type: oracledb.STRING },
          tel: { val: pro_tel, type: oracledb.STRING },
          cor: { val: pro_cor, type: oracledb.STRING },
          dir: { val: pro_dir, type: oracledb.STRING },
          est: { val: pro_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { pro_emp, pro_ruc, pro_con, pro_tel, pro_cor, pro_dir, pro_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PROVEEDORES_UPDATE(:id, :emp, :ruc, :con, :tel, :cor, :dir, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          emp: { val: pro_emp, type: oracledb.STRING },
          ruc: { val: pro_ruc, type: oracledb.STRING },
          con: { val: pro_con, type: oracledb.STRING },
          tel: { val: pro_tel, type: oracledb.STRING },
          cor: { val: pro_cor, type: oracledb.STRING },
          dir: { val: pro_dir, type: oracledb.STRING },
          est: { val: pro_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  remove: async (id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PROVEEDORES_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default ProveedorModel;