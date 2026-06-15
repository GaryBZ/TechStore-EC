import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const InventarioModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_INVENTARIO_GETALL(:cursor); END;`,
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
        `BEGIN SP_INVENTARIO_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  getByProducto: async (prd_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_INVENTARIO_GETBYPRODUCTO(:prd_id, :cursor); END;`,
        { prd_id: { val: Number(prd_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ prd_id, inv_stk_act, inv_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_INVENTARIO_CREATE(:prd_id, :stk_act, :est, :cursor); END;`,
        {
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          stk_act: { val: Number(inv_stk_act), type: oracledb.NUMBER },
          est: { val: inv_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { prd_id, inv_stk_act, inv_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_INVENTARIO_UPDATE(:id, :prd_id, :stk_act, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          stk_act: { val: Number(inv_stk_act), type: oracledb.NUMBER },
          est: { val: inv_est, type: oracledb.STRING },
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
        `BEGIN SP_INVENTARIO_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default InventarioModel;