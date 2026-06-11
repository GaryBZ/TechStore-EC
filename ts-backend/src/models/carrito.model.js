import db from '../config/db.js';

const CarritoModel = {

  getAll: async () => {
    const r = await db.query(`SELECT * FROM ADMIN."carrito" ORDER BY 1 ASC`);
    return r.rows;
  },

  getById: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."carrito" WHERE car_id = :1`, [id]);
    return r.rows[0];
  },

  getByCliente: async (cli_id) => {
    const r = await db.query(
      `SELECT * FROM ADMIN."carrito" WHERE cli_id = :1 ORDER BY car_id ASC`,
      [cli_id]
    );
    return r.rows;
  },

  create: async ({ cli_id, car_est }) => {
    await db.query(
      `INSERT INTO ADMIN."carrito" (car_id, cli_id, car_fec_cre, car_est)
       VALUES (ADMIN."carrito_seq".NEXTVAL, :1, SYSTIMESTAMP, :2)`,
      [cli_id, car_est]
    );
    const r = await db.query(
      `SELECT * FROM ADMIN."carrito" WHERE car_id = (SELECT MAX(car_id) FROM ADMIN."carrito")`
    );
    return r.rows[0];
  },

  update: async (id, { cli_id, car_est }) => {
    await db.query(
      `UPDATE ADMIN."carrito" SET cli_id=:1, car_est=:2 WHERE car_id=:3`,
      [cli_id, car_est, id]
    );
    const r = await db.query(`SELECT * FROM ADMIN."carrito" WHERE car_id = :1`, [id]);
    return r.rows[0];
  },

  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."carrito" WHERE car_id = :1`, [id]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."carrito" WHERE car_id = :1`, [id]);
    return r.rows[0];
  },

};

export default CarritoModel;