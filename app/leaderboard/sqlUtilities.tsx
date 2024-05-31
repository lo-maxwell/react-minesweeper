interface QueryOptions {
	sql: string;
	values: unknown[];
  }

export function createInsertQuery(table_name: string, query_data: any): QueryOptions {
	if (!table_name) {
		throw new Error('Table name is required');
	}
	const filtered_data: any = {};
    for (const key in query_data) {
        if (key !== 'id') {
            filtered_data[key] = query_data[key];
        }
    }
	const columns = Object.keys(filtered_data);
	const values = Object.values(filtered_data);
	const columnsPart = columns.join(', ');
	const placeholders = columns.map(() => '?').join(', ');
	const sql = `
			INSERT INTO ${table_name} (
				${columnsPart}
			) VALUES (
				${placeholders}
			)
		`;
	return { sql, values};
}

export function createUpdateQuery(table_name: string, query_data: any, id: number): QueryOptions {
	if (!table_name) {
		throw new Error('Table name is required');
	}
	const filtered_data: any = {};
    for (const key in query_data) {
        if (key !== 'id') {
            filtered_data[key] = query_data[key];
        }
    }
	const columns = Object.keys(filtered_data);
	const values = Object.values(filtered_data);
	const setPart = columns.map((col) => `${col} = ?`).join(', ');
	// const placeholders = columns.map(() => '?').join(', ');
	const sql = `
			UPDATE ${table_name}
			SET ${setPart}
			WHERE id = ?
		`;
	values.push(id);
	return { sql, values};
}

export function createSelectQuery(table_name: string, columns: string[] = [], where: Record<string, string> = {}, orderBy: string = '', limit: number): QueryOptions {
	if (!table_name) {
		throw new Error('Table name is required');
	}

	const columnsPart = columns.length ? columns.join(', ') : '*';
	let sql = `SELECT ${columnsPart} FROM ${table_name}`;

	const whereKeys = Object.keys(where);
	const values = []
	if (whereKeys.length > 0) {
		const whereConditions = whereKeys.map(key => `${key} = ?`);
		sql += ` WHERE ${whereConditions.join(' AND ')}`;
		values.push(...Object.values(where));
	}

	if (orderBy) {
		sql += ` ORDER BY ${orderBy}`;
	}

	if (limit) {
		sql += ` LIMIT ${limit}`;
	}

	return { sql, values };
}

export function createDeleteQuery(table_name: string, where: any): QueryOptions {
	if (!table_name) {
		throw new Error('Table name is required');
	}
	let sql = `DELETE FROM ${table_name}`;
	const whereKeys = Object.keys(where);
	const values = []
	if (whereKeys.length > 0) {
		const whereConditions = whereKeys.map(key => `${key} = ?`);
		sql += ` WHERE ${whereConditions.join(' AND ')}`;
		values.push(...Object.values(where));
	} else {
		throw new Error('No where clauses specified, cancelling transaction');
	}

	return { sql, values };
}

export interface DeleteResult {
    affectedRows: number;
}

export interface UpdateResult {
	affectedRows: number;
	changedRows: number;
}

export interface CreateResult {
    affectedRows: number;
    insertId: number;
}

export interface SelectResult<T> {
	rows: T[]; // Array of selected rows
    fields: any[]; // Metadata about the returned rows
}

