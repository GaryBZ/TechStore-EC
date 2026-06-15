import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const MovimientoModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_MOVIMIENTOS_GETALL(:cursor); END;`,
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
        `BEGIN SP_MOVIMIENTOS_GETBYID(:id, :cursor); END;`,
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
        `BEGIN SP_MOVIMIENTOS_GETBYPRODUCTO(:prd_id, :cursor); END;`,
        { prd_id: { val: Number(prd_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ prd_id, usu_id, ped_id, mov_tip, mov_can, mov_mot, mov_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_MOVIMIENTOS_CREATE(:prd_id, :usu_id, :ped_id, :tip, :can, :mot, :est, :cursor); END;`,
        {
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          usu_id: { val: Number(usu_id), type: oracledb.NUMBER },
          ped_id: { val: ped_id ? Number(ped_id) : null, type: oracledb.NUMBER },
          tip: { val: mov_tip, type: oracledb.STRING },
          can: { val: Number(mov_can), type: oracledb.NUMBER },
          mot: { val: mov_mot, type: oracledb.STRING },
          est: { val: mov_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { prd_id, usu_id, ped_id, mov_tip, mov_can, mov_mot, mov_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_MOVIMIENTOS_UPDATE(:id, :prd_id, :usu_id, :ped_id, :tip, :can, :mot, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          usu_id: { val: Number(usu_id), type: oracledb.NUMBER },
          ped_id: { val: ped_id ? Number(ped_id) : null, type: oracledb.NUMBER },
          tip: { val: mov_tip, type: oracledb.STRING },
          can: { val: Number(mov_can), type: oracledb.NUMBER },
          mot: { val: mov_mot, type: oracledb.STRING },
          est: { val: mov_est, type: oracledb.STRING },
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
        `BEGIN SP_MOVIMIENTOS_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default MovimientoModel;