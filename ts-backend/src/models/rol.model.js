import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const RolModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ROLES_GETALL(:cursor); END;`,
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
        `BEGIN SP_ROLES_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await result.outBinds.cursor.getRows();
      await result.outBinds.cursor.close();
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ rol_nom, rol_des, rol_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ROLES_CREATE(:nom, :des, :est, :cursor); END;`,
        {
          nom: { val: rol_nom, type: oracledb.STRING },
          des: { val: rol_des, type: oracledb.STRING },
          est: { val: rol_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { rol_nom, rol_des, rol_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ROLES_UPDATE(:id, :nom, :des, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          nom: { val: rol_nom, type: oracledb.STRING },
          des: { val: rol_des, type: oracledb.STRING },
          est: { val: rol_est, type: oracledb.STRING },
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
        `BEGIN SP_ROLES_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default RolModel;