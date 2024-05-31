import { createDeleteQuery, createUpdateQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import { ResultSetHeader } from "mysql2/promise";
import URL from 'url';

export default async function handler(req: any, res: any) {
	console.log("Connecting to database...");
  
	try {
	  	// Execute database initialization queries
	  	const parsedUrl = URL.parse(req.url, true);
		const pathname = parsedUrl.pathname;
		const query = parsedUrl.query;
		if (Object.keys(query).length == 0) {
			const msg = 'Attempted to delete with no conditions, cancelling transaction.';
			console.log(msg);
			res.status(500).json({ message: 'Attempted to delete with no conditions, cancelling transaction.' });
		}
	  	
		const deleteQuery = createDeleteQuery(dbConfig.LEADERBOARD_TABLE_NAME, query);
	

		let [result] = await pool.query<ResultSetHeader>(deleteQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry deleted successfully');
		console.log('Affected rows: ', result.affectedRows);
		res.status(200).json({ 	message: 'Leaderboard entry deleted successfully', 
								affectedRows: result.affectedRows });
	} catch (err) {
		console.error('Error deleting leaderboard entry:', err);
		res.status(500).json({ error: 'Error deleting leaderboard entry' });
	}
  }