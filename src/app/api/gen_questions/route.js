// src/app/api/gen_questions/route.js

import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'assessmentbuddy',
    password: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();

    // Fetch all topics
    const topicsResult = await client.query('SELECT * FROM topics');
    const topics = topicsResult.rows;
    var topic_id = []
    const questionsByTopic = {};

    // Loop through each topic to fetch its questions
    for (const topic of topics) {
      const questionsResult = await client.query(
        'SELECT * FROM general_questions WHERE topic_id = $1',
        [topic.topic_id]
      );
      questionsByTopic[topic.topic_name] = questionsResult.rows;
    }

    await client.end();

    return NextResponse.json(questionsByTopic);
  } catch (err) {
    await client.end();
    return NextResponse.json({ success: false, error: err.message });
  }
}
