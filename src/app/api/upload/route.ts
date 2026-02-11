import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/pdfParser';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // 파일 유효성 검사
    if (!file) {
      return NextResponse.json(
        { error: '파일을 선택하세요' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드 가능합니다' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF 파싱
    const parsed = await parsePDF(buffer);

    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const safeFileName = file.name.replace(/[^a-zA-Z0-9가-힣.-]/g, '_');
    const fileName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(uploadDir, fileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    // JSON.parse(JSON.stringify()) 를 통해 Date, Uint8Array 등
    // non-serializable 객체를 제거하여 structured clone 오류를 방지
    const safeParsed = JSON.parse(JSON.stringify(parsed));

    return NextResponse.json({
      success: true,
      fileName,
      filePath: `/uploads/${fileName}`,
      fileSize: file.size,
      parsed: safeParsed,
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Upload error stack:', error instanceof Error ? error.stack : 'no stack');
    
    // 에러 타입에 따른 메시지
    let message = '파일 처리 중 오류가 발생했습니다';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      try {
        message = JSON.stringify(error);
      } catch {
        message = String(error);
      }
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// 업로드 가능한 파일 타입 확인용 GET 엔드포인트
export async function GET() {
  return NextResponse.json({
    allowedTypes: ['application/pdf'],
    maxSize: MAX_FILE_SIZE,
    maxSizeFormatted: '10MB',
  });
}
