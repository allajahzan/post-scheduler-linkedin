import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || name.length < 2) {
      return NextResponse.json({ message: 'Name must be at least 2 characters' }, { status: 400 });
    }

    const db = await getDb();
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { name } }
    );

    return NextResponse.json({ success: true, name });
  } catch (error) {
    console.error('Update name error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
