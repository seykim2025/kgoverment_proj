import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assess } from '@/lib/ai/assessor';

export const dynamic = 'force-dynamic';
import { z } from 'zod';

const assessmentRequestSchema = z.object({
  noticeTitle: z.string().min(1, '공고명을 입력하세요'),
  noticeContent: z.string().min(10, '공고문 내용이 너무 짧습니다'),
  pdfPath: z.string().optional(),
});

// POST: AI 판단 실행
export async function POST(request: NextRequest) {
  try {
    // 회사 정보 확인
    const company = await prisma.company.findFirst({
      include: {
        projectHistories: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: '먼저 회사 정보를 등록해주세요' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 요청 검증
    const result = assessmentRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { noticeTitle, noticeContent, pdfPath } = result.data;

    // AI 판단 실행
    const assessmentResult = await assess({
      noticeTitle,
      noticeContent,
      company: {
        companyName: company.companyName,
        businessNumber: company.businessNumber,
        representativeName: company.representativeName,
        foundedDate: company.foundedDate.toISOString(),
        address: company.address,
        companyType: company.companyType,
        companyScale: company.companyScale,
        recentRevenue: company.recentRevenue,
        debtRatio: company.debtRatio,
        researcherCount: company.researcherCount,
        patentCount: company.patentCount,
        technologies: company.technologies,
        certifications: company.certifications,
      },
      projects: company.projectHistories.map((p: { projectName: string; managingAgency: string; performPeriod: string; role: string; budget: number | null; result: string; summary: string | null; keywords: string | null }) => ({
        projectName: p.projectName,
        managingAgency: p.managingAgency,
        performPeriod: p.performPeriod,
        role: p.role,
        budget: p.budget,
        result: p.result,
        summary: p.summary,
        keywords: p.keywords,
      })),
    });

    if (!assessmentResult.success || !assessmentResult.result) {
      return NextResponse.json(
        { error: assessmentResult.error || 'AI 판단에 실패했습니다' },
        { status: 500 }
      );
    }

    const aiResult = assessmentResult.result;

    // 판단 결과 저장
    const assessment = await prisma.assessment.create({
      data: {
        noticeTitle,
        noticeContent,
        pdfPath: pdfPath || null,
        eligibilityStatus: aiResult.eligibility_check.status,
        eligibilityFailReason: aiResult.eligibility_check.fail_reason || null,
        quantitativeScore: aiResult.quantitative_score_prediction.estimated_score
          ? parseFloat(aiResult.quantitative_score_prediction.estimated_score) || null
          : null,
        quantitativeStrengths: JSON.stringify(aiResult.quantitative_score_prediction.strength),
        quantitativeWeaknesses: JSON.stringify(aiResult.quantitative_score_prediction.weakness),
        qualitativeRelevanceScore: aiResult.qualitative_fit_analysis.relevance_score,
        qualitativeReasoning: aiResult.qualitative_fit_analysis.reasoning,
        qualitativeKeywords: JSON.stringify(aiResult.qualitative_fit_analysis.key_matching_keywords),
        trafficLight: aiResult.final_verdict.traffic_light,
        summary: aiResult.final_verdict.summary,
        rawAiResponse: assessmentResult.rawResponse || null,
        companyId: company.id,
      },
    });

    return NextResponse.json({
      success: true,
      assessment: {
        id: assessment.id,
        ...aiResult,
      },
    });
  } catch (error) {
    console.error('AI 판단 API 오류:', error);
    return NextResponse.json(
      { error: 'AI 판단 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// GET: 판단 이력 조회
export async function GET(_request: NextRequest) {
  try {
    const company = await prisma.company.findFirst();

    if (!company) {
      return NextResponse.json({ assessments: [] });
    }

    const assessments = await prisma.assessment.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        noticeTitle: true,
        eligibilityStatus: true,
        trafficLight: true,
        qualitativeRelevanceScore: true,
        summary: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('판단 이력 조회 오류:', error);
    return NextResponse.json(
      { error: '판단 이력을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}
