import db from "../config/db.js";

const ProveedorModel = {
  getAll: async () =>
    (await db.query(`SELECT * FROM ADMIN."proveedores" ORDER BY 1 ASC`))
      .rows,
  getById: async (id) =>
    (await db.query(`SELECT * FROM ADMIN."proveedores" WHERE pro_id=:1`, [id]))
      .rows[0],
  create: async ({
    pro_emp,
    pro_ruc,
    pro_con,
    pro_tel,
    pro_cor,
    pro_dir,
    pro_est,
  }) => {
    await db.query(
      `INSERT INTO ADMIN."proveedores" (pro_id,pro_emp,pro_ruc,pro_con,pro_tel,pro_cor,pro_dir,pro_est)
       VALUES (ADMIN."proveedores_seq".NEXTVAL,:1,:2,:3,:4,:5,:6,:7)`,
      [pro_emp, pro_ruc, pro_con, pro_tel, pro_cor, pro_dir, pro_est],
    );
    return (
      await db.query(
        `SELECT * FROM ADMIN."proveedores" WHERE pro_id=(SELECT MAX(pro_id) FROM ADMIN."proveedores")`,
      )
    ).rows[0];
  },

  update: async (
    id,
    { pro_emp, pro_ruc, pro_con, pro_tel, pro_cor, pro_dir, pro_est },
  ) => {
    await db.query(
      `UPDATE ADMIN."proveedores" SET pro_emp=:1,pro_ruc=:2,pro_con=:3,pro_tel=:4,pro_cor=:5,pro_dir=:6,pro_est=:7 WHERE pro_id=:8`,
      [pro_emp, pro_ruc, pro_con, pro_tel, pro_cor, pro_dir, pro_est, id],
    );
    return (
      await db.query(`SELECT * FROM ADMIN."proveedores" WHERE pro_id=:1`, [id])
    ).rows[0];
  },

  remove: async (id) => {
    const r = await db.query(
      `SELECT * FROM ADMIN."proveedores" WHERE pro_id=:1`,
      [id],
    );
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."proveedores" WHERE pro_id=:1`, [id]);
    return r.rows[0];
  },
};

export default ProveedorModel;
