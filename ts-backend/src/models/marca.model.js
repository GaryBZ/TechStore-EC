import db from '../config/db.js';

const MarcaModel = {

  getAll: async () => {
    const result = await db.query(
      `SELECT * FROM ADMIN."marcas" ORDER BY 1 ASC`
    );
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query(
      `SELECT * FROM ADMIN."marcas" WHERE mar_id = :1`,
      [id]
    );
    return result.rows[0];
  },

  create: async ({ mar_nom, mar_des, mar_est }) => {
    const result = await db.query(
      `INSERT INTO ADMIN."marcas" (mar_id, mar_nom, mar_des, mar_est)
       VALUES (ADMIN."marcas_seq".NEXTVAL, :1, :2, :3)
       RETURNING mar_id INTO :4`,
      {
        autoCommit: true,
        bindDefs: [
          { type: 'STRING', maxSize: 80 },
          { type: 'STRING', maxSize: 200 },
          { type: 'STRING', maxSize: 1 },
          { type: 'NUMBER', dir: 3003 }, // BIND_OUT
        ],
      }
    );
    // Retornamos el registro recién creado
    const newId = result.outBinds?.[0]?.[0];
    if (newId) {
      const created = await db.query(
        `SELECT * FROM ADMIN."marcas" WHERE mar_id = :1`, [newId]
      );
      return created.rows[0];
    }
    return null;
  },

  update: async (id, { mar_nom, mar_des, mar_est }) => {
    await db.query(
      `UPDATE ADMIN."marcas"
       SET mar_nom = :1, mar_des = :2, mar_est = :3
       WHERE mar_id = :4`,
      [mar_nom, mar_des, mar_est, id]
    );
    const result = await db.query(
      `SELECT * FROM ADMIN."marcas" WHERE mar_id = :1`, [id]
    );
    return result.rows[0];
  },

  remove: async (id) => {
    const before = await db.query(
      `SELECT * FROM ADMIN."marcas" WHERE mar_id = :1`, [id]
    );
    if (!before.rows[0]) return null;
    await db.query(
      `DELETE FROM ADMIN."marcas" WHERE mar_id = :1`, [id]
    );
    return before.rows[0];
  },

};

export default MarcaModel;