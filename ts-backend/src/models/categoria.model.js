import db from "../config/db.js";
import oracledb from "oracledb";
import { cursorToObjects } from "../utils/cursor.js";

const CategoriaModel = {
  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN sp_categorias_getall(:cursor); END;`,
        { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
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
        `BEGIN sp_categorias_getbyid(:id, :cursor); END;`,
        {
          id: { val: id, type: oracledb.NUMBER },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  create: async ({ cat_nom, cat_des, cat_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN sp_categorias_create(:nom, :des, :est, :cursor); END;`,
        {
          nom: { val: cat_nom, type: oracledb.STRING },
          des: { val: cat_des, type: oracledb.STRING },
          est: { val: cat_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },

  update: async (id, { cat_nom, cat_des, cat_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN sp_categorias_update(:id, :nom, :des, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          nom: { val: cat_nom, type: oracledb.STRING },
          des: { val: cat_des, type: oracledb.STRING },
          est: { val: cat_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
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
        `BEGIN sp_categorias_delete(:id, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        },
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally {
      await conn.close();
    }
  },
};

export default CategoriaModel;