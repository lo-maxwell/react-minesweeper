import pool from '@/db/connectionPool';

async function handler() {
  console.log("Connecting to database...");
  try {
    // Execute database initialization queries
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        time INT NOT NULL,
        difficulty VARCHAR(255) NOT NULL
      );
    `;
    await pool.query(createTableQuery); //shorthand for getConnection -> connection.query -> connection.release()
                                        //use that instead if you want to run multiple queries on the same connection,
                                        //as multiple calls to pool.query will run in parallel
    console.log('Database initialized successfully');
    // res.status(200).json({ message: 'Database initialized successfully' });
  } catch (err) {
    console.error('Error initializing database:', err);
    // res.status(500).json({ error: 'Database initialization error' });
  }
}

export async function initDatabase() {
	return await handler();
}
