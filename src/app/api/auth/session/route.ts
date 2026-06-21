import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: 'Unauthorized session' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'User does not exist' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal validation failure' },
      { status: 500 }
    );
  }
}
