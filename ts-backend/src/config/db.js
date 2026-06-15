import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/oracle/b2/.env' });

oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB });

let pool;

export const initPool = async () => {
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  });
  console.log('Pool Oracle conectado');
};

const db = {
  query: async (sql, params = []) => {
    const conn = await pool.getConnection();
    try {
      const result = await conn.execute(sql, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
      });

      if (result.rows) {
        result.rows = result.rows.map(row =>
          Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])
          )
        );
      }

      return result;
    } finally {
      await conn.close();
    }
  },

  getConnection: async () => {
    return await pool.getConnection();
  },
};

export default db;