import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { companySchema } from '@/lib/schemas/company';

// GET: 회사 정보 조회 (단일 회사)
export async function GET() {
  try {
    const company = await prisma.company.findFirst({
      include: {
        projectHistories: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!company) {
      return NextResponse.json({ company: null }, { status: 200 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('회사 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '회사 정보를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 회사 정보 생성/수정 (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Zod 유효성 검사
    const result = companySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // 기존 회사 확인
    const existingCompany = await prisma.company.findFirst();

    let company;
    if (existingCompany) {
      // 업데이트
      company = await prisma.company.update({
        where: { id: existingCompany.id },
        data: {
          businessNumber: data.businessNumber,
          companyName: data.companyName,
          representativeName: data.representativeName,
          foundedDate: new Date(data.foundedDate),
          address: data.address,
          companyType: data.companyType,
          companyScale: data.companyScale,
          recentRevenue: data.recentRevenue ?? null,
          debtRatio: data.debtRatio ?? null,
          researcherCount: data.researcherCount ?? null,
          patentCount: data.patentCount ?? null,
          technologies: data.technologies ?? null,
          certifications: data.certifications ?? null,
        },
      });
    } else {
      // 생성
      company = await prisma.company.create({
        data: {
          businessNumber: data.businessNumber,
          companyName: data.companyName,
          representativeName: data.representativeName,
          foundedDate: new Date(data.foundedDate),
          address: data.address,
          companyType: data.companyType,
          companyScale: data.companyScale,
          recentRevenue: data.recentRevenue ?? null,
          debtRatio: data.debtRatio ?? null,
          researcherCount: data.researcherCount ?? null,
          patentCount: data.patentCount ?? null,
          technologies: data.technologies ?? null,
          certifications: data.certifications ?? null,
        },
      });
    }

    return NextResponse.json({ company, message: '저장되었습니다' });
  } catch (error) {
    console.error('회사 정보 저장 오류:', error);
    return NextResponse.json(
      { error: '회사 정보 저장에 실패했습니다' },
      { status: 500 }
    );
  }
}
