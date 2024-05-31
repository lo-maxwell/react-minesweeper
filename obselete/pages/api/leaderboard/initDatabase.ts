import pool from '@/db/connectionPool';
import mysql from 'mysql2';
import dbConfig from '../../../../db/db.config';

export default async function handler(req: any, res: any) {
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
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (err) {
    console.error('Error initializing database:', err);
    res.status(500).json({ error: 'Database initialization error' });
  }
}


/*
export default async function handler(req: any, res: any) {
  console.log("Connecting to database...");

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Execute database initialization queries
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS leaderboard (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          time INT NOT NULL,
          difficulty VARCHAR(255) NOT NULL
        );
      `;

      await connection.query(createTableQuery);
      console.log('Database initialized successfully');
      res.status(200).json({ message: 'Database initialized successfully' });
    } catch (err) {
      console.error('Error initializing database:', err);
      res.status(500).json({ error: 'Database initialization error' });
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
}
*/