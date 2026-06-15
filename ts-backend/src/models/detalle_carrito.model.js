import db from "../config/db.js";
import oracledb from "oracledb";
import { cursorToObjects } from "../utils/cursor.js";

const DetalleCarritoModel = {
  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_CARRITO_GETALL(:cursor); END;`,
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
        `BEGIN SP_DETALLE_CARRITO_GETBYID(:id, :cursor); END;`,
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

  getByCarrito: async (car_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_CARRITO_GETBYCARRITO(:car_id, :cursor); END;`,
        {
          car_id: { val: Number(car_id), type: oracledb.NUMBER },
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

  create: async ({
    car_id,
    prd_id,
    dca_can,
    dca_pre_uni,
    dca_sub,
    dca_est,
  }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_CARRITO_CREATE(:car_id, :prd_id, :can, :pre_uni, :sub, :est, :cursor); END;`,
        {
          car_id: { val: Number(car_id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          can: { val: Number(dca_can), type: oracledb.NUMBER },
          pre_uni: { val: Number(dca_pre_uni), type: oracledb.NUMBER },
          sub: { val: Number(dca_sub), type: oracledb.NUMBER },
          est: { val: dca_est, type: oracledb.STRING },
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

  update: async (
    id,
    { car_id, prd_id, dca_can, dca_pre_uni, dca_sub, dca_est },
  ) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_CARRITO_UPDATE(:id, :car_id, :prd_id, :can, :pre_uni, :sub, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          car_id: { val: Number(car_id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          can: { val: Number(dca_can), type: oracledb.NUMBER },
          pre_uni: { val: Number(dca_pre_uni), type: oracledb.NUMBER },
          sub: { val: Number(dca_sub), type: oracledb.NUMBER },
          est: { val: dca_est, type: oracledb.STRING },
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
        `BEGIN SP_DETALLE_CARRITO_DELETE(:id, :cursor); END;`,
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

export default DetalleCarritoModel;
