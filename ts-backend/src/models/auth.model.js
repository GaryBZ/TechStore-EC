import db from '../config/db.js';
import { cursorToObjects } from "../utils/cursor.js";

const AuthModel = {

  getByEmail: async (email) => {
    const r = await db.query(
      `SELECT u."usu_id", u."usu_nom", u."usu_ape", u."usu_cor", u."usu_pas", 
              u."usu_tel", u."usu_est", u."rol_id", r."rol_nom"
       FROM ADMIN."usuarios" u
       JOIN ADMIN."roles" r ON u."rol_id" = r."rol_id"
       WHERE LOWER(u."usu_cor") = LOWER(:1)`,
      [email]
    );
    return r.rows[0] || null;
  },

};

export default AuthModel;