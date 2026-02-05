import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Ping the database to check connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB!',
      database: db.databaseName,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
