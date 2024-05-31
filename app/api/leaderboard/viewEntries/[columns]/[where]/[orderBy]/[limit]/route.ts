'use server'
import { NextResponse } from "next/server"
import { LeaderboardEntry } from "@/app/leaderboard/LeaderboardEntry";
import { createInsertQuery, createSelectQuery } from "@/app/leaderboard/sqlUtilities";
import pool from "@/db/connectionPool";
import dbConfig from "@/db/db.config";
import URL from 'url';
import { ParsedUrlQuery } from "querystring";

function validateClauses(query_data: {columns: string[], where: Record<string, string>, orderBy: string, limit: string | Number} | null) {
	if (query_data == null) {
		return {columns: [], where: {}, orderBy: '', limit: 1000};
	}
	let columns = query_data['columns'] ? query_data['columns'] : [];
	let where = query_data['where'] ? query_data['where'] : {};
	let orderBy = query_data['orderBy'] ? query_data['orderBy'] : '';
	let limit = query_data['limit'] ? Number(query_data['limit']) : 1000;
	return {columns: columns, where: where, orderBy: orderBy, limit: limit};
}

function massageQueryParams(query_params: ParsedUrlQuery) {
	if (query_params == null) {
		return {columns: [], where: {}, orderBy: '', limit: 1000};
	}
	let columns = Array.isArray(query_params.columns) ? query_params.columns : (query_params.columns ? query_params.columns.split(",") : []);
	let where: Record<string, string> = {};
	if (query_params.where) {
		const whereClauses = Array.isArray(query_params.where) ? query_params.where : query_params.where.split(",");
		console.log(whereClauses);
		whereClauses.forEach((clause) => {
		  const [key, value] = clause.split('=');
		  if (key && value) where[key] = value;
		});
	  }
	const orderBy = Array.isArray(query_params.orderBy) ? query_params.orderBy[0] : query_params.orderBy || '';
	const limit = Array.isArray(query_params.limit) ? query_params.limit[0] : query_params.limit || '';

	return {columns, where, orderBy, limit: limit ? parseInt(limit, 10) : 1000};
}

async function handler(data: {columns: string[], where: Record<string, string>, orderBy: string, limit: number} | null) {
	console.log("Connecting to database...");
  
	try {
	  // Execute database initialization queries
		const {columns, where, orderBy, limit} = validateClauses(data);
		// const limit = data == null ? 1000 : data.limit;
		const selectQuery = createSelectQuery(dbConfig.LEADERBOARD_TABLE_NAME, columns, where, orderBy, limit);

		const [rows, fields] = await pool.query(selectQuery); //shorthand for getConnection -> connection.query -> connection.release()
											//use that instead if you want to run multiple queries on the same connection,
											//as multiple calls to pool.query will run in parallel
		console.log('Entries selected successfully:', rows);
		console.log(fields);
		// res.status(200).json({ message: 'Entries selected successfully', data: rows });
		return rows;
	} catch (err) {
		console.error('Error selecting leaderboard entry:', err);
		// res.status(500).json({ error: 'Error selecting leaderboard entry' });
		return null;
	}
  }

export async function getViewEntries(data: {columns: string[], where: Record<string, string>, orderBy: string, limit: number} | null) {
	// post to api
	return await handler(data);
}


//Exposes api at /api/leaderboard/viewEntriess/*/1=1,time=999/id/100
export async function GET(request: Request, { params }: { params: {columns: string[], where: string[], orderBy: string[], limit: string[]}}) { 
	// const parsedUrl = URL.parse(request.url, true);
	// const pathname = parsedUrl.pathname;
	// const query = parsedUrl.query;
	// console.log(query);
	console.log(params);
	const {columns, where, orderBy, limit} = massageQueryParams(params); //TODO: Fix query
	return NextResponse.json(await getViewEntries({columns, where, orderBy, limit}));
}