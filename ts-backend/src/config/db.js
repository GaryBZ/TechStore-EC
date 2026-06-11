import oracledb from 'oracledb';

oracledb.initOracleClient({ libDir: '/u01/app/oracle/product/19.0.0/dbhome_1/lib' });

let pool;

export const initPool = async () => {
  pool = await oracledb.createPool({
    user: 'ADMIN',
    password: 'Admin123',
    connectString: 'localhost:1521/PDBECOMMERCE',
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
};

export default db;