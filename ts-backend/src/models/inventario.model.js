import db from '../config/db.js';

const InventarioModel = {

  getAll: async () => {
    const r = await db.query(`SELECT * FROM ADMIN."inventario" ORDER BY 1 ASC`);
    return r.rows;
  },

  getById: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."inventario" WHERE inv_id = :1`, [id]);
    return r.rows[0];
  },

  getByProducto: async (prd_id) => {
    const r = await db.query(
      `SELECT * FROM ADMIN."inventario" WHERE prd_id = :1`,
      [prd_id]
    );
    return r.rows[0];
  },

  create: async ({ prd_id, inv_stk_act, inv_est }) => {
    await db.query(
      `INSERT INTO ADMIN."inventario" (inv_id, prd_id, inv_stk_act, inv_fec_act, inv_est)
       VALUES (ADMIN."inventario_seq".NEXTVAL, :1, :2, SYSTIMESTAMP, :3)`,
      [prd_id, inv_stk_act, inv_est]
    );
    const r = await db.query(
      `SELECT * FROM ADMIN."inventario" WHERE inv_id = (SELECT MAX(inv_id) FROM ADMIN."inventario")`
    );
    return r.rows[0];
  },

  update: async (id, { prd_id, inv_stk_act, inv_est }) => {
    await db.query(
      `UPDATE ADMIN."inventario"
       SET prd_id=:1, inv_stk_act=:2, inv_fec_act=SYSTIMESTAMP, inv_est=:3
       WHERE inv_id=:4`,
      [prd_id, inv_stk_act, inv_est, id]
    );
    const r = await db.query(`SELECT * FROM ADMIN."inventario" WHERE inv_id = :1`, [id]);
    return r.rows[0];
  },

  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."inventario" WHERE inv_id = :1`, [id]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."inventario" WHERE inv_id = :1`, [id]);
    return r.rows[0];
  },

};

export default InventarioModel;