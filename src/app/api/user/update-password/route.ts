import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession, comparePassword, hashPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password || new_password.length < 6) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isValid = await comparePassword(current_password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    const hashedPassword = await hashPassword(new_password);

    await db.collection('users').updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
