// src/app/api/submission/route.js

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
    const { user_id, topic_id, question_type, question_id, selected_option} = await request.json(); // Destructure input values

    // Connect to the PostgreSQL client
    await client.connect();

    // SQL query to insert a new row into the mcq_questions table
    const insertQuery = `
      INSERT INTO answer_submissions(user_id, topic_id, question_type, question_id, answer)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // Insert values into the table
    const result = await client.query(insertQuery, [ user_id, topic_id, question_type, question_id, selected_option]);

    // Close the connection
    await client.end();

    // Return the inserted data
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    await client.end();
    return NextResponse.json({ success: false, error: err.message });
  }
}
