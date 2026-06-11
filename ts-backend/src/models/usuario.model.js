import db from '../config/db.js';

const UsuarioModel = {

  getAll: async () => {
    const r = await db.query(`SELECT * FROM ADMIN."usuarios" ORDER BY 1 ASC`);
    return r.rows;
  },

  getById: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."usuarios" WHERE usu_id = :1`, [id]);
    return r.rows[0];
  },

  getByRol: async (rol_id) => {
    const r = await db.query(
      `SELECT * FROM ADMIN."usuarios" WHERE rol_id = :1 ORDER BY usu_id ASC`,
      [rol_id]
    );
    return r.rows;
  },

  create: async ({ rol_id, usu_nom, usu_ape, usu_cor, usu_pas, usu_tel, usu_est }) => {
    await db.query(
      `INSERT INTO ADMIN."usuarios" (usu_id,rol_id,usu_nom,usu_ape,usu_cor,usu_pas,usu_tel,usu_est,usu_fec_reg)
       VALUES (ADMIN."usuarios_seq".NEXTVAL,:1,:2,:3,:4,:5,:6,:7,SYSTIMESTAMP)`,
      [rol_id, usu_nom, usu_ape, usu_cor, usu_pas, usu_tel, usu_est]
    );
    const r = await db.query(
      `SELECT * FROM ADMIN."usuarios" WHERE usu_id = (SELECT MAX(usu_id) FROM ADMIN."usuarios")`
    );
    return r.rows[0];
  },

  update: async (id, { rol_id, usu_nom, usu_ape, usu_cor, usu_pas, usu_tel, usu_est }) => {
    await db.query(
      `UPDATE ADMIN."usuarios"
       SET rol_id=:1, usu_nom=:2, usu_ape=:3, usu_cor=:4, usu_pas=:5, usu_tel=:6, usu_est=:7
       WHERE usu_id=:8`,
      [rol_id, usu_nom, usu_ape, usu_cor, usu_pas, usu_tel, usu_est, id]
    );
    const r = await db.query(`SELECT * FROM ADMIN."usuarios" WHERE usu_id = :1`, [id]);
    return r.rows[0];
  },

  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."usuarios" WHERE usu_id = :1`, [id]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."usuarios" WHERE usu_id = :1`, [id]);
    return r.rows[0];
  },

};

export default UsuarioModel;