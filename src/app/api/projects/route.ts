import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/schemas/project';

export const dynamic = 'force-dynamic';

// GET: 모든 과제 이력 조회
export async function GET(_request: NextRequest) {
  try {
    const company = await prisma.company.findFirst();

    if (!company) {
      return NextResponse.json(
        { error: '먼저 회사 정보를 등록하세요' },
        { status: 400 }
      );
    }

    const projects = await prisma.projectHistory.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('과제 이력 조회 오류:', error);
    return NextResponse.json(
      { error: '과제 이력을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 새 과제 이력 추가
export async function POST(request: NextRequest) {
  try {
    const company = await prisma.company.findFirst();

    if (!company) {
      return NextResponse.json(
        { error: '먼저 회사 정보를 등록하세요' },
        { status: 400 }
      );
    }

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

    const project = await prisma.projectHistory.create({
      data: {
        projectName: data.projectName,
        managingAgency: data.managingAgency,
        performPeriod: data.performPeriod,
        role: data.role,
        budget: data.budget ?? null,
        result: data.result,
        summary: data.summary ?? null,
        keywords: data.keywords ?? null,
        companyId: company.id,
      },
    });

    return NextResponse.json({ project, message: '과제가 추가되었습니다' });
  } catch (error) {
    console.error('과제 이력 추가 오류:', error);
    return NextResponse.json(
      { error: '과제 이력 추가에 실패했습니다' },
      { status: 500 }
    );
  }
}
