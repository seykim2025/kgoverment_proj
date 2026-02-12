import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/schemas/project';

export const dynamic = 'force-dynamic';

// GET: 특정 과제 상세 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.projectHistory.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: '과제를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('과제 조회 오류:', error);
    return NextResponse.json(
      { error: '과제 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 과제 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Zod 유효성 검사
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    const project = await prisma.projectHistory.update({
      where: { id },
      data: {
        projectName: data.projectName,
        managingAgency: data.managingAgency,
        performPeriod: data.performPeriod,
        role: data.role,
        budget: data.budget ?? null,
        result: data.result,
        summary: data.summary ?? null,
        keywords: data.keywords ?? null,
      },
    });

    return NextResponse.json({ project, message: '수정되었습니다' });
  } catch (error) {
    console.error('과제 수정 오류:', error);
    return NextResponse.json(
      { error: '과제 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 과제 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.projectHistory.delete({
      where: { id },
    });

    return NextResponse.json({ message: '삭제되었습니다' });
  } catch (error) {
    console.error('과제 삭제 오류:', error);
    return NextResponse.json(
      { error: '과제 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
