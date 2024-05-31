import { LeaderboardEntry } from "@/app/leaderboard/LeaderboardEntry";
import { createInsertQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import { ResultSetHeader } from "mysql2/promise";
import URL from 'url';

function createLeaderboardEntry(item_data: any): LeaderboardEntry {
	let newEntry = new LeaderboardEntry(0, "Anonymous", 999, "Beginner");
	if (item_data.name) newEntry.username = item_data.name;
	if (item_data.time) newEntry.time = item_data.time;
	if (item_data.difficulty) newEntry.difficulty = item_data.difficulty;
	return newEntry;
}

export default async function handler(req: any, res: any) {
	console.log("Connecting to database...");
  
	try {
	  // Execute database initialization queries
	  	const parsedUrl = URL.parse(req.url, true);
		const pathname = parsedUrl.pathname;
		const query = parsedUrl.query;
		let newLeaderboardEntry = createLeaderboardEntry(query);
		// const { sql, values } = createInsertQuery(this.table_name, newLeaderboardEntry.getEntry());
		const insertQuery = createInsertQuery(dbConfig.LEADERBOARD_TABLE_NAME, {id: newLeaderboardEntry.id, username: newLeaderboardEntry.username, time: newLeaderboardEntry.time, difficulty: newLeaderboardEntry.difficulty});
	

		let [result] = await pool.query<ResultSetHeader>(insertQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry added successfully');
		console.log('Insert id: ', result.insertId);
		res.status(200).json({ message: 'Leaderboard entry added successfully', insertId: result.insertId });
	} catch (err) {
		console.error('Error adding leaderboard entry:', err);
		res.status(500).json({ error: 'Error adding leaderboard entry' });
	}
  }