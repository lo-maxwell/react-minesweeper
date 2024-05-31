import { LeaderboardEntry } from "@/app/leaderboard/LeaderboardEntry";
import { createInsertQuery, createSelectQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import URL from 'url';

function parseSelectClauses(query_data: any) {
	let columns: string[] = [];
	let where: Record<string, string> = {};
	let orderBy: string = '';
	columns = query_data['columns'] ? query_data['columns'].split(', ') : [];
	if (query_data['where']) {
		let whereClauses = query_data['where'].split('&');
		where = {};
		whereClauses.forEach((element: any) => {
			const whereKey = element.split('=')[0];
			const whereValue = element.split('=')[1];
			where[whereKey] = whereValue;
		})
	}
	orderBy = query_data['order_by'] ? query_data['order_by'] : '';
	return {columns: columns, where: where, orderBy: orderBy};
}


export default async function handler(req: any, res: any) {
	console.log("Connecting to database...");
  
	try {
	  // Execute database initialization queries
	  	const parsedUrl = URL.parse(req.url, true);
		const pathname = parsedUrl.pathname;
		const query = parsedUrl.query;
		const {columns, where, orderBy} = parseSelectClauses(query);
		const selectQuery = createSelectQuery(dbConfig.LEADERBOARD_TABLE_NAME, columns, where, orderBy, 1000);

		const [rows, fields] = await pool.query(selectQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		// console.log('Entries selected successfully:', rows);
		res.status(200).json({ message: 'Entries selected successfully', data: rows });
	} catch (err) {
		console.error('Error selecting leaderboard entry:', err);
		res.status(500).json({ error: 'Error selecting leaderboard entry' });
	}
  }