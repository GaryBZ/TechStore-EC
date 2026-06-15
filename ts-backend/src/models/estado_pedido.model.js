import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const EstadoPedidoModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ESTADOS_GETALL(:cursor); END;`,
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
        `BEGIN SP_ESTADOS_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ epd_nom, epd_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ESTADOS_CREATE(:nom, :est, :cursor); END;`,
        {
          nom: { val: epd_nom, type: oracledb.STRING },
          est: { val: epd_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { epd_nom, epd_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_ESTADOS_UPDATE(:id, :nom, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          nom: { val: epd_nom, type: oracledb.STRING },
          est: { val: epd_est, type: oracledb.STRING },
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
        `BEGIN SP_ESTADOS_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default EstadoPedidoModel;