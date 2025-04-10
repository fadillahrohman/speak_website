import mysql from "mysql2/promise";
// Connect database
let connection: mysql.Connection | null = null;

const connectionToDatabase = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }
  return connection;
};

export default connectionToDatabase;
