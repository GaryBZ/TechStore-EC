import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const DetallePedidoModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_PEDIDO_GETALL(:cursor); END;`,
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
        `BEGIN SP_DETALLE_PEDIDO_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  getByPedido: async (ped_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_PEDIDO_GETBYPEDIDO(:ped_id, :cursor); END;`,
        { ped_id: { val: Number(ped_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ ped_id, prd_id, dpe_can, dpe_pre_uni, dpe_sub, dpe_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_PEDIDO_CREATE(:ped_id, :prd_id, :can, :pre_uni, :sub, :est, :cursor); END;`,
        {
          ped_id: { val: Number(ped_id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          can: { val: Number(dpe_can), type: oracledb.NUMBER },
          pre_uni: { val: Number(dpe_pre_uni), type: oracledb.NUMBER },
          sub: { val: Number(dpe_sub), type: oracledb.NUMBER },
          est: { val: dpe_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { ped_id, prd_id, dpe_can, dpe_pre_uni, dpe_sub, dpe_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_DETALLE_PEDIDO_UPDATE(:id, :ped_id, :prd_id, :can, :pre_uni, :sub, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          ped_id: { val: Number(ped_id), type: oracledb.NUMBER },
          prd_id: { val: Number(prd_id), type: oracledb.NUMBER },
          can: { val: Number(dpe_can), type: oracledb.NUMBER },
          pre_uni: { val: Number(dpe_pre_uni), type: oracledb.NUMBER },
          sub: { val: Number(dpe_sub), type: oracledb.NUMBER },
          est: { val: dpe_est, type: oracledb.STRING },
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
        `BEGIN SP_DETALLE_PEDIDO_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default DetallePedidoModel;