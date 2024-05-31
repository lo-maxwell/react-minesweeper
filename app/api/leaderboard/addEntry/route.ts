'use server'
import { LeaderboardEntry } from "@/app/leaderboard/LeaderboardEntry";
import { createInsertQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import { ResultSetHeader } from "mysql2/promise";
import URL from 'url';

function createLeaderboardEntry(item_data: LeaderboardEntry): LeaderboardEntry {
	let newEntry = new LeaderboardEntry(0, "Anonymous", 999, "Beginner");
	if (item_data.username) newEntry.username = item_data.username;
	if (item_data.time) newEntry.time = item_data.time;
	if (item_data.difficulty) newEntry.difficulty = item_data.difficulty;
	return newEntry;
}

async function handler(entry: LeaderboardEntry) {
	console.log("Connecting to database...");
  
	try {
		let newLeaderboardEntry = createLeaderboardEntry(entry);
		const insertQuery = createInsertQuery(dbConfig.LEADERBOARD_TABLE_NAME, {id: newLeaderboardEntry.id, username: newLeaderboardEntry.username, time: newLeaderboardEntry.time, difficulty: newLeaderboardEntry.difficulty});

		let [result] = await pool.query<ResultSetHeader>(insertQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry added successfully');
		console.log('Insert id: ', result.insertId);
		// res.status(200).json({ message: 'Leaderboard entry added successfully', insertId: result.insertId });
	} catch (err) {
		console.error('Error adding leaderboard entry:', err);
		// res.status(500).json({ error: 'Error adding leaderboard entry' });
	}
  }

export async function addEntry(data: {id: number, username: string, time: number, difficulty: string}) {
	return await handler(data);
}