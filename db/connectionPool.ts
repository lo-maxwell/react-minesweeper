import mysql from 'mysql2/promise';
import dbConfig from './db.config';

const pool = mysql.createPool({
	host: dbConfig.HOST,
	user: dbConfig.USER,
	password: dbConfig.PASSWORD,
	database: dbConfig.DATABASE,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});
export default pool;