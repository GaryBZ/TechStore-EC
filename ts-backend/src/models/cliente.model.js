import db from "../config/db.js";

const ClienteModel = {
  getAll: async () =>
    (await db.query(`SELECT * FROM ADMIN."clientes" ORDER BY 1 ASC`)).rows,
  getById: async (id) =>
    (await db.query(`SELECT * FROM ADMIN."clientes" WHERE cli_id = :1`, [id]))
      .rows[0],
  create: async ({
    ciu_id,
    cli_nom,
    cli_ape,
    cli_ced,
    cli_cor,
    cli_tel,
    cli_dir,
    cli_est,
  }) => {
    await db.query(
      `INSERT INTO ADMIN."clientes" (cli_id,ciu_id,cli_nom,cli_ape,cli_ced,cli_cor,cli_tel,cli_dir,cli_est,cli_fec_reg)
       VALUES (ADMIN."clientes_seq".NEXTVAL,:1,:2,:3,:4,:5,:6,:7,:8,SYSTIMESTAMP)`,
      [ciu_id, cli_nom, cli_ape, cli_ced, cli_cor, cli_tel, cli_dir, cli_est],
    );
    return (
      await db.query(
        `SELECT * FROM ADMIN."clientes" WHERE cli_id=(SELECT MAX(cli_id) FROM ADMIN."clientes")`,
      )
    ).rows[0];
  },

  update: async (
    id,
    { ciu_id, cli_nom, cli_ape, cli_ced, cli_cor, cli_tel, cli_dir, cli_est },
  ) => {
    await db.query(
      `UPDATE ADMIN."clientes" SET ciu_id=:1,cli_nom=:2,cli_ape=:3,cli_ced=:4,cli_cor=:5,cli_tel=:6,cli_dir=:7,cli_est=:8 WHERE cli_id=:9`,
      [
        ciu_id,
        cli_nom,
        cli_ape,
        cli_ced,
        cli_cor,
        cli_tel,
        cli_dir,
        cli_est,
        id,
      ],
    );
    return (
      await db.query(`SELECT * FROM ADMIN."clientes" WHERE cli_id=:1`, [id])
    ).rows[0];
  },
  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."clientes" WHERE cli_id=:1`, [
      id,
    ]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."clientes" WHERE cli_id=:1`, [id]);
    return r.rows[0];
  },
};

export default ClienteModel;
