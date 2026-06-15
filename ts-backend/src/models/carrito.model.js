import db from "../config/db.js";
import oracledb from "oracledb";
import { cursorToObjects } from "../utils/cursor.js";

const CarritoModel = {
  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_GETALL(:cursor); END;`,
        { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return await cursorToObjects(result.outBinds.cursor);
    } finally {
      await conn.close();
    }
  },

  getById: async (id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_GETBYID(:id, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  getByCliente: async (cli_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_GETBYCLIENTE(:cli_id, :cursor); END;`,
        {
          cli_id: { val: Number(cli_id), type: oracledb.NUMBER },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  create: async ({ cli_id, car_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_CREATE(:cli_id, :est, :cursor); END;`,
        {
          cli_id: { val: Number(cli_id), type: oracledb.NUMBER },
          est: { val: car_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  update: async (id, { cli_id, car_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_UPDATE(:id, :cli_id, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cli_id: { val: Number(cli_id), type: oracledb.NUMBER },
          est: { val: car_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  remove: async (id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_CARRITO_DELETE(:id, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },
};

export default CarritoModel;
