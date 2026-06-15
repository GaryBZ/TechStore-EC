import db from '../config/db.js';
import oracledb from 'oracledb';
import { cursorToObjects } from "../utils/cursor.js";

const ProductoModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PRODUCTOS_GETALL(:cursor); END;`,
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
        `BEGIN SP_PRODUCTOS_GETBYID(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  getByMarca: async (mar_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PRODUCTOS_GETBYMARCA(:mar_id, :cursor); END;`,
        { mar_id: { val: Number(mar_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  getByCategoria: async (cat_id) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PRODUCTOS_GETBYCATEGORIA(:cat_id, :cursor); END;`,
        { cat_id: { val: Number(cat_id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  create: async ({ cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PRODUCTOS_CREATE(:cat_id, :pro_id, :mar_id, :nom, :des, :sku, :img, :pre_com, :pre_ven, :stk_min, :est, :cursor); END;`,
        {
          cat_id: { val: Number(cat_id), type: oracledb.NUMBER },
          pro_id: { val: Number(pro_id), type: oracledb.NUMBER },
          mar_id: { val: Number(mar_id), type: oracledb.NUMBER },
          nom: { val: prd_nom, type: oracledb.STRING },
          des: { val: prd_des, type: oracledb.STRING },
          sku: { val: prd_sku, type: oracledb.STRING },
          img: { val: pro_img, type: oracledb.STRING },
          pre_com: { val: Number(prd_pre_com), type: oracledb.NUMBER },
          pre_ven: { val: Number(prd_pre_ven), type: oracledb.NUMBER },
          stk_min: { val: Number(prd_stk_min), type: oracledb.NUMBER },
          est: { val: prd_est, type: oracledb.STRING },
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

  update: async (id, { cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est }) => {
    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN SP_PRODUCTOS_UPDATE(:id, :cat_id, :pro_id, :mar_id, :nom, :des, :sku, :img, :pre_com, :pre_ven, :stk_min, :est, :cursor); END;`,
        {
          id: { val: Number(id), type: oracledb.NUMBER },
          cat_id: { val: Number(cat_id), type: oracledb.NUMBER },
          pro_id: { val: Number(pro_id), type: oracledb.NUMBER },
          mar_id: { val: Number(mar_id), type: oracledb.NUMBER },
          nom: { val: prd_nom, type: oracledb.STRING },
          des: { val: prd_des, type: oracledb.STRING },
          sku: { val: prd_sku, type: oracledb.STRING },
          img: { val: pro_img, type: oracledb.STRING },
          pre_com: { val: Number(prd_pre_com), type: oracledb.NUMBER },
          pre_ven: { val: Number(prd_pre_ven), type: oracledb.NUMBER },
          stk_min: { val: Number(prd_stk_min), type: oracledb.NUMBER },
          est: { val: prd_est, type: oracledb.STRING },
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
        `BEGIN SP_PRODUCTOS_DELETE(:id, :cursor); END;`,
        { id: { val: Number(id), type: oracledb.NUMBER }, cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const rows = await cursorToObjects(result.outBinds.cursor);
      return rows[0] || null;
    } finally { await conn.close(); }
  },

};

export default ProductoModel;