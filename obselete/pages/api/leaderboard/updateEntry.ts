import { createUpdateQuery } from "@/app/leaderboard/sqlUtilities";
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
		const filtered_data: any = {};
			for (const key in query) {
				if (key !== 'id') {
					filtered_data[key] = query[key];
				}
			}
	  	
		const updateQuery = createUpdateQuery(dbConfig.LEADERBOARD_TABLE_NAME, filtered_data, Number(query['id']));
	

		const [result] = await pool.query<ResultSetHeader>(updateQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry updated successfully');
		console.log('Affected rows: ', result.affectedRows);
		res.status(200).json({ 	message: 'Leaderboard entry updated successfully', 
								affectedRows: result.affectedRows });
	} catch (err) {
		console.error('Error updating leaderboard entry:', err);
		res.status(500).json({ error: 'Error updating leaderboard entry' });
	}
  }