// src/app/api/scoresubmit/route.js

import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'assessmentbuddy',
    password: 'postgres',
    port: 5432,
  });

  try {
    const { user_id, final_score} = await request.json(); // Destructure input values

    // Connect to the PostgreSQL client
    await client.connect();

    // SQL query to insert a new row into the mcq_questions table
    const insertQuery = `
      INSERT INTO final_score(user_id, final_score)
      VALUES ($1, $2)
      RETURNING *;
    `;

    // Insert values into the table
    const result = await client.query(insertQuery, [ user_id, final_score]);

    // Close the connection
    await client.end();

    // Return the inserted data
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    await client.end();
    return NextResponse.json({ success: false, error: err.message });
  }
}
