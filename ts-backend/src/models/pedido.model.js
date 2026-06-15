import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const PedidoModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PEDIDOS_GETALL(:cursor); END;`,
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
        `BEGIN SP_PEDIDOS_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  getByCliente: async (cli_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PEDIDOS_GETBYCLIENTE(:cli_id, :cursor); END;`,
        { cli_id: { val: Number(cli_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PEDIDOS_CREATE(:cli_id, :epd_id, :ciu_id, :sub, :iva, :tot, :dir_env, :obs, :est, :cursor); END;`,
        {
          cli_id: { val: Number(cli_id), type: oracledb.NUMBER },
          epd_id: { val: Number(epd_id), type: oracledb.NUMBER },
          ciu_id: { val: ciu_id ? Number(ciu_id) : null, type: oracledb.NUMBER },
          sub: { val: Number(ped_sub), type: oracledb.NUMBER },
          iva: { val: Number(ped_iva), type: oracledb.NUMBER },
          tot: { val: Number(ped_tot), type: oracledb.NUMBER },
          dir_env: { val: ped_dir_env, type: oracledb.STRING },
          obs: { val: ped_obs, type: oracledb.STRING },
          est: { val: ped_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PEDIDOS_UPDATE(:id, :cli_id, :epd_id, :ciu_id, :sub, :iva, :tot, :dir_env, :obs, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cli_id: { val: Number(cli_id), type: oracledb.NUMBER },
          epd_id: { val: Number(epd_id), type: oracledb.NUMBER },
          ciu_id: { val: ciu_id ? Number(ciu_id) : null, type: oracledb.NUMBER },
          sub: { val: Number(ped_sub), type: oracledb.NUMBER },
          iva: { val: Number(ped_iva), type: oracledb.NUMBER },
          tot: { val: Number(ped_tot), type: oracledb.NUMBER },
          dir_env: { val: ped_dir_env, type: oracledb.STRING },
          obs: { val: ped_obs, type: oracledb.STRING },
          est: { val: ped_est, type: oracledb.STRING },
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
        `BEGIN SP_PEDIDOS_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default PedidoModel;