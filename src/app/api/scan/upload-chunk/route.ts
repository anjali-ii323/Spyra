import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyzeApk } from '@/lib/analysisEngine';
import fs from 'fs';
import path from 'path';

// Disable default body parser if needed, but App Router handles Request directly
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunkFile = formData.get('chunk') as File | null;
    const fileName = formData.get('fileName') as string | null;
    const chunkIndexStr = formData.get('chunkIndex') as string | null;
    const totalChunksStr = formData.get('totalChunks') as string | null;
    const uploadId = formData.get('uploadId') as string | null;

    if (!chunkFile || !fileName || chunkIndexStr === null || totalChunksStr === null || !uploadId) {
      return NextResponse.json({ error: 'Missing chunk upload metadata parameters.' }, { status: 400 });
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    const totalChunks = parseInt(totalChunksStr, 10);

    const arrayBuffer = await chunkFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Setup temporary directory structure inside workspace
    const tempDir = path.join(process.cwd(), 'tmp', 'uploads', uploadId);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save individual chunk to disk
    const chunkPath = path.join(tempDir, `chunk_${chunkIndex}`);
    fs.writeFileSync(chunkPath, buffer);

    // If this is the last chunk, merge all chunks and analyze
    if (chunkIndex === totalChunks - 1) {
      const mergedFilePath = path.join(process.cwd(), 'tmp', 'uploads', `merged_${uploadId}_${fileName}`);
      
      // Ensure parent directory for merged file exists
      const mergedParentDir = path.dirname(mergedFilePath);
      if (!fs.existsSync(mergedParentDir)) {
        fs.mkdirSync(mergedParentDir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(mergedFilePath);

      // Sequentially append each chunk to the merged file
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (err) => reject(err));

        try {
          for (let i = 0; i < totalChunks; i++) {
            const partPath = path.join(tempDir, `chunk_${i}`);
            
            // Wait for chunk file to exist and append it
            if (!fs.existsSync(partPath)) {
              throw new Error(`Chunk part ${i} missing during merge phase.`);
            }

            const chunkData = fs.readFileSync(partPath);
            writeStream.write(chunkData);
          }
          writeStream.end();
        } catch (err) {
          writeStream.destroy();
          reject(err);
        }
      });

      // Clean up chunk files and directory
      for (let i = 0; i < totalChunks; i++) {
        const partPath = path.join(tempDir, `chunk_${i}`);
        if (fs.existsSync(partPath)) {
          fs.unlinkSync(partPath);
        }
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir);
      }

      // Determine user session or default guest account
      let userId: string;
      const session = getSession(req);

      if (session) {
        userId = session.userId;
      } else {
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

      // Analyze merged APK file directly from disk path (OOM protection)
      const analysis = await analyzeApk(mergedFilePath, fileName);

      // Clean up merged file from disk
      if (fs.existsSync(mergedFilePath)) {
        fs.unlinkSync(mergedFilePath);
      }

      // Save scan to Database
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
    }

    // Return progress acknowledgement
    return NextResponse.json({
      message: `Chunk ${chunkIndex + 1} of ${totalChunks} uploaded successfully.`,
      uploadedChunkIndex: chunkIndex,
    });
  } catch (error: any) {
    console.error('Chunk upload and merge API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process APK chunked upload.' },
      { status: 500 }
    );
  }
}
