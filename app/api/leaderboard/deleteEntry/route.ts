import { createDeleteQuery, createUpdateQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import { ResultSetHeader } from "mysql2/promise";

async function handler(where: Record<string, string>) {
	console.log("Connecting to database...");
	try {
	  	// Execute database initialization queries
		if (Object.keys(where).length == 0) {
			const msg = 'Attempted to delete with no conditions, cancelling transaction.';
			console.log(msg);
			return;
			// res.status(500).json({ message: 'Attempted to delete with no conditions, cancelling transaction.' });
		}
		const deleteQuery = createDeleteQuery(dbConfig.LEADERBOARD_TABLE_NAME, where);

		let [result] = await pool.query<ResultSetHeader>(deleteQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Leaderboard entry deleted successfully');
		console.log('Affected rows: ', result.affectedRows);
	} catch (err) {
		console.error('Error deleting leaderboard entry:', err);
	}
  }

export async function deleteEntry(where: Record<string, string>) {
	return await handler(where);
}