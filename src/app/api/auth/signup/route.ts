import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { UserDocument } from '@/types';

export async function POST(request: Request) {
  try {
    const { name, email, password, telegram_chat_id } = await request.json();

    if (!name || !email || !password || !telegram_chat_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const existingUser = await db.collection<UserDocument>('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection<UserDocument>('users').insertOne({
      name,
      email,
      password: hashedPassword,
      telegram_chat_id,
      created_at: new Date(),
    });

    const token = await signToken({ userId: result.insertedId.toString(), email });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true, user: { name, email, telegram_chat_id } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
