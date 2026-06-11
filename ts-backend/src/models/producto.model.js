import db from '../config/db.js';

const ProductoModel = {
  getAll: async () => {
    const r = await db.query(`SELECT * FROM ADMIN."productos" ORDER BY 1 ASC`);
    return r.rows;
  },
  getById: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE prd_id = :1`, [id]);
    return r.rows[0];
  },
  getByMarca: async (mar_id) => {
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE mar_id = :1 ORDER BY prd_id ASC`, [mar_id]);
    return r.rows;
  },
  getByCategoria: async (cat_id) => {
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE cat_id = :1 ORDER BY prd_id ASC`, [cat_id]);
    return r.rows;
  },
  create: async ({ cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est }) => {
    await db.query(
      `INSERT INTO ADMIN."productos" (prd_id,cat_id,pro_id,mar_id,prd_nom,prd_des,prd_sku,pro_img,prd_pre_com,prd_pre_ven,prd_stk_min,prd_est,prd_fec_cre)
       VALUES (ADMIN."productos_seq".NEXTVAL,:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,SYSTIMESTAMP)`,
      [cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est]
    );
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE prd_id = (SELECT MAX(prd_id) FROM ADMIN."productos")`);
    return r.rows[0];
  },
  update: async (id, { cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est }) => {
    await db.query(
      `UPDATE ADMIN."productos" SET cat_id=:1,pro_id=:2,mar_id=:3,prd_nom=:4,prd_des=:5,prd_sku=:6,pro_img=:7,prd_pre_com=:8,prd_pre_ven=:9,prd_stk_min=:10,prd_est=:11 WHERE prd_id=:12`,
      [cat_id, pro_id, mar_id, prd_nom, prd_des, prd_sku, pro_img, prd_pre_com, prd_pre_ven, prd_stk_min, prd_est, id]
    );
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE prd_id = :1`, [id]);
    return r.rows[0];
  },
  remove: async (id) => {
    const r = await db.query(`SELECT * FROM ADMIN."productos" WHERE prd_id = :1`, [id]);
    if (!r.rows[0]) return null;
    await db.query(`DELETE FROM ADMIN."productos" WHERE prd_id = :1`, [id]);
    return r.rows[0];
  },
};
export default ProductoModel;