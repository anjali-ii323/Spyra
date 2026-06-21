import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized scan log request' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get('id');

    // Retrieve single scan details if ID is provided
    if (scanId) {
      const scan = await db.scan.findUnique({
        where: { id: scanId },
        include: { report: true },
      });

      if (!scan) {
        return NextResponse.json({ error: 'Scan record not found' }, { status: 404 });
      }

      // Check access permission (admins can view anything; users check owner userId)
      if (scan.userId !== session.userId && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Access denied to this scan report' }, { status: 403 });
      }

      return NextResponse.json({ scan });
    }

    // Retrieve list of scans for current user
    const search = searchParams.get('search') || '';
    const riskLevel = searchParams.get('riskLevel') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId: session.userId,
    };

    if (search) {
      whereClause.apkName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (riskLevel && riskLevel !== 'ALL') {
      whereClause.riskLevel = riskLevel;
    }

    const totalScans = await db.scan.count({
      where: whereClause,
    });

    const scans = await db.scan.findMany({
      where: whereClause,
      orderBy: { uploadDate: 'desc' },
      skip,
      take: limit,
      include: {
        report: {
          select: {
            threatIntel: true,
          },
        },
      },
    });

    return NextResponse.json({
      scans,
      pagination: {
        total: totalScans,
        page,
        limit,
        pages: Math.ceil(totalScans / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch scan history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan logs history' },
      { status: 500 }
    );
  }
}
