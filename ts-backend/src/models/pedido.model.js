import db from '../config/db.js';

const PedidoModel = {

  getAll: async () => {
    const r = await db.query(`SELECT * FROM ADMIN."pedidos" ORDER BY 1 ASC`);
    return r.rows;
  },

  getById: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."pedidos" WHERE ped_id = :1`, [id]);
    return r.rows[0];
  },

  getByCliente: async (cli_id) => {
    const r = await db.query(
      `SELECT * FROM ADMIN."pedidos" WHERE cli_id = :1 ORDER BY ped_id ASC`,
      [cli_id]
    );
    return r.rows;
  },

  create: async ({ cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est }) => {
    await db.query(
      `INSERT INTO ADMIN."pedidos" (ped_id,cli_id,epd_id,ciu_id,ped_fec,ped_sub,ped_iva,ped_tot,ped_dir_env,ped_obs,ped_est)
       VALUES (ADMIN."pedidos_seq".NEXTVAL,:1,:2,:3,SYSTIMESTAMP,:4,:5,:6,:7,:8,:9)`,
      [cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est]
    );
    const r = await db.query(
      `SELECT * FROM ADMIN."pedidos" WHERE ped_id = (SELECT MAX(ped_id) FROM ADMIN."pedidos")`
    );
    return r.rows[0];
  },

  update: async (id, { cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est }) => {
    await db.query(
      `UPDATE ADMIN."pedidos"
       SET cli_id=:1, epd_id=:2, ciu_id=:3, ped_sub=:4, ped_iva=:5, ped_tot=:6, ped_dir_env=:7, ped_obs=:8, ped_est=:9
       WHERE ped_id=:10`,
      [cli_id, epd_id, ciu_id, ped_sub, ped_iva, ped_tot, ped_dir_env, ped_obs, ped_est, id]
    );
    const r = await db.query(`SELECT * FROM ADMIN."pedidos" WHERE ped_id = :1`, [id]);
    return r.rows[0];
  },

  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."pedidos" WHERE ped_id = :1`, [id]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."pedidos" WHERE ped_id = :1`, [id]);
    return r.rows[0];
  },

};

export default PedidoModel;