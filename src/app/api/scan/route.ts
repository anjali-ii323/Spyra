import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyzeApk } from '@/lib/analysisEngine';

export async function POST(req: NextRequest) {
  try {
    // Determine authenticated user or fallback to demo account
    let userId: string;
    const session = getSession(req);

    if (session) {
      userId = session.userId;
    } else {
      // Find or create a default guest user for public sandbox uploads
      let guestUser = await db.user.findFirst({
        where: { email: 'guest@spyra.ai' },
      });

      if (!guestUser) {
        guestUser = await db.user.create({
          data: {
            name: 'Guest Threat Analyst',
            email: 'guest@spyra.ai',
            password: 'guest_no_auth_password_123',
            role: 'USER',
          },
        });
      }
      userId = guestUser.id;
    }

    // Parse formData for files
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No APK file uploaded' }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Call malware static analysis engine
    const analysis = await analyzeApk(fileBuffer, fileName);

    // Save scan inside DB
    const scan = await db.scan.create({
      data: {
        userId,
        apkName: fileName,
        threatScore: analysis.threatScore,
        riskLevel: analysis.riskLevel,
        report: {
          create: {
            permissions: analysis.permissions as any,
            behaviors: analysis.behaviors as any,
            recommendations: analysis.recommendations as any,
            explanation: analysis.explanation,
            threatIntel: analysis.threatIntel as any,
          },
        },
      },
      include: {
        report: true,
      },
    });

    return NextResponse.json({
      message: 'Analysis completed successfully',
      scanId: scan.id,
      threatScore: scan.threatScore,
      riskLevel: scan.riskLevel,
      analysis,
    });
  } catch (error: any) {
    console.error('APK upload and analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process APK file analysis' },
      { status: 500 }
    );
  }
}
