import OpenAI from 'openai';
import { 
  SYSTEM_PROMPT, 
  buildUserPrompt, 
  parseAiResponse,
  CompanyProfile,
  ProjectHistoryItem,
  AssessmentResult
} from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AssessmentInput {
  noticeTitle: string;
  noticeContent: string;
  company: CompanyProfile;
  projects: ProjectHistoryItem[];
}

export interface AssessmentOutput {
  success: boolean;
  result?: AssessmentResult;
  rawResponse?: string;
  error?: string;
}

export async function assessEligibility(input: AssessmentInput): Promise<AssessmentOutput> {
  try {
    const userPrompt = buildUserPrompt(
      input.noticeContent,
      input.company,
      input.projects
    );

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 3000,
    });

    const rawResponse = completion.choices[0]?.message?.content || '';
    const result = parseAiResponse(rawResponse);

    if (!result) {
      return {
        success: false,
        rawResponse,
        error: 'AI 응답을 파싱할 수 없습니다',
      };
    }

    return {
      success: true,
      result,
      rawResponse,
    };
  } catch (error) {
    console.error('AI 판단 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI 판단 중 오류가 발생했습니다',
    };
  }
}

// 테스트/데모용 Mock 함수 — 미입력 필드 수에 따라 다른 결과 반환
export async function assessEligibilityMock(input: AssessmentInput): Promise<AssessmentOutput> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 미입력 필드 개수에 따라 엄격하게 판정
  const company = input.company;
  const missingFields: string[] = [];
  if (!company.recentRevenue) missingFields.push('매출액');
  if (!company.debtRatio && company.debtRatio !== 0) missingFields.push('부채비율');
  if (!company.researcherCount) missingFields.push('연구인력 수');
  if (!company.patentCount && company.patentCount !== 0) missingFields.push('특허 수');
  if (!company.technologies) missingFields.push('보유 기술');
  if (!company.certifications) missingFields.push('인증 현황');

  const hasManyMissing = missingFields.length >= 3;
  const hasProjects = input.projects.length > 0;

  let trafficLight: 'GREEN' | 'YELLOW' | 'RED';
  let status: 'PASS' | 'FAIL' | 'CONDITIONAL';
  let score: number;
  let relevance: number;

  if (hasManyMissing && !hasProjects) {
    trafficLight = 'RED';
    status = 'FAIL';
    score = 30;
    relevance = 20;
  } else if (hasManyMissing || !hasProjects) {
    trafficLight = 'YELLOW';
    status = 'CONDITIONAL';
    score = 50;
    relevance = 45;
  } else {
    trafficLight = 'YELLOW';
    status = 'PASS';
    score = 65;
    relevance = 60;
  }

  const mockResult: AssessmentResult = {
    eligibility_check: {
      status,
      fail_reason: status === 'FAIL'
        ? `기업 정보 미입력 항목(${missingFields.join(', ')})이 많아 정량 평가 불가. 수행 과제 이력 없음.`
        : status === 'CONDITIONAL'
          ? `다음 항목이 미입력이어 최하 수준으로 가정: ${missingFields.join(', ')}`
          : undefined,
      checked_items: [
        '접수기한: UNKNOWN (Mock 모드 - 실제 API 키 필요)',
        `업력요건: ${company.foundedDate ? 'PASS' : 'UNKNOWN'}`,
        `기업정보 완성도: ${missingFields.length === 0 ? 'PASS' : `FAIL (미입력: ${missingFields.join(', ')})`}`,
        `수행과제 이력: ${hasProjects ? 'PASS' : 'FAIL (이력 없음)'}`,
      ],
    },
    quantitative_score_prediction: {
      estimated_score: `${score}점 (미입력 항목 0점 처리)`,
      strength: hasProjects
        ? ['과거 과제 수행 경험 보유']
        : [],
      weakness: [
        ...missingFields.map(f => `${f} 미입력 → 0점 처리`),
        ...(!hasProjects ? ['과거 수행 과제 이력 없음'] : []),
      ],
    },
    qualitative_fit_analysis: {
      relevance_score: relevance,
      reasoning: `[Mock 응답] OPENAI_API_KEY를 설정하면 실제 AI 분석이 실행됩니다. 현재는 기업 정보 완성도 기반 간이 판정입니다. 미입력 항목 ${missingFields.length}개.`,
      key_matching_keywords: [],
    },
    final_verdict: {
      traffic_light: trafficLight,
      summary: trafficLight === 'RED'
        ? `기업 정보가 대부분 미입력이고 수행 과제 이력이 없어 지원이 어렵습니다. 기업 정보를 먼저 완성해 주세요.`
        : trafficLight === 'YELLOW'
          ? `${missingFields.length > 0 ? `미입력 항목(${missingFields.join(', ')})이 있어 정확한 판단이 어렵습니다.` : ''} ${!hasProjects ? '수행 과제 이력이 없어 감점 요인입니다.' : '추가 검토가 필요합니다.'} 기업 정보 보완 후 재분석을 권장합니다.`
          : `기본 자격 요건은 충족하나, 실제 AI 분석(API 키 설정)을 통해 정확한 판정을 받으십시오.`,
    },
  };

  return {
    success: true,
    result: mockResult,
    rawResponse: JSON.stringify(mockResult, null, 2),
  };
}

// API 키 유무에 따라 적절한 함수 선택
export async function assess(input: AssessmentInput): Promise<AssessmentOutput> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY가 설정되지 않아 Mock 응답을 사용합니다.');
    return assessEligibilityMock(input);
  }
  return assessEligibility(input);
}
