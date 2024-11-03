// src/app/api/login/route.js 
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request) {
  const { email, password } = await request.json();

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'assessmentbuddy',
    password: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT user_password FROM user_info WHERE user_email = $1', [email]);
    const userIDResult = await client.query('SELECT user_id FROM user_info WHERE user_email = $1', [email]);
  
    await client.end();

    if (res.rows.length > 0 && res.rows[0].user_password === password) {
      const userID = userIDResult.rows[0].user_id;
      return NextResponse.json({ success: true, userID });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
  
}
