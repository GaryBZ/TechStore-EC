import db from '../config/db.js';

const CategoriaModel = {

  getAll: async () => {
    const result = await db.query(
      `SELECT * FROM ADMIN."categorias" ORDER BY 1 ASC`
    );
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query(
      `SELECT * FROM ADMIN."categorias" WHERE cat_id = :1`,
      [id]
    );
    return result.rows[0];
  },

  create: async ({ cat_nom, cat_des, cat_est }) => {
    await db.query(
      `INSERT INTO ADMIN."categorias" (cat_id, cat_nom, cat_des, cat_est)
       VALUES (ADMIN."categorias_seq".NEXTVAL, :1, :2, :3)`,
      [cat_nom, cat_des, cat_est]
    );
    const result = await db.query(
      `SELECT * FROM ADMIN."categorias" WHERE cat_id = (SELECT MAX(cat_id) FROM ADMIN."categorias")`
    );
    return result.rows[0];
  },

  update: async (id, { cat_nom, cat_des, cat_est }) => {
    await db.query(
      `UPDATE ADMIN."categorias"
       SET cat_nom = :1, cat_des = :2, cat_est = :3
       WHERE cat_id = :4`,
      [cat_nom, cat_des, cat_est, id]
    );
    const result = await db.query(
      `SELECT * FROM ADMIN."categorias" WHERE cat_id = :1`, [id]
    );
    return result.rows[0];
  },

  remove: async (id) => {
    const before = await db.query(
      `SELECT * FROM ADMIN."categorias" WHERE cat_id = :1`, [id]
    );
    if (!before.rows[0]) return null;
    await db.query(
      `DELETE FROM ADMIN."categorias" WHERE cat_id = :1`, [id]
    );
    return before.rows[0];
  },

};

export default CategoriaModel;