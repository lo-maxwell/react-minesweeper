import { createUpdateQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import { ResultSetHeader } from "mysql2/promise";

async function handler(data: {id: number, username: string | null, time: number | null, difficulty: string | null}) {
	console.log("Connecting to database...");
  
	try {
	  	// Execute database initialization queries
		const filtered_data: Record<string, string> = {};
		if (data.username) filtered_data['username'] = data.username;
		if (data.time) filtered_data['time'] = String(data.time);
		if (data.difficulty) filtered_data['username'] = data.difficulty;
	  	
		const updateQuery = createUpdateQuery(dbConfig.LEADERBOARD_TABLE_NAME, filtered_data, Number(data['id']));
	

		const [result] = await pool.query<ResultSetHeader>(updateQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry updated successfully');
		console.log('Affected rows: ', result.affectedRows);
		// res.status(200).json({ 	message: 'Leaderboard entry updated successfully', 
		// 						affectedRows: result.affectedRows });
	} catch (err) {
		console.error('Error updating leaderboard entry:', err);
		// res.status(500).json({ error: 'Error updating leaderboard entry' });
	}
  }

export async function updateEntry(data: {id: number, username: string, time: number, difficulty: string}) {
	return await handler(data);
}