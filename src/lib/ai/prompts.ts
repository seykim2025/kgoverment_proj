// AI 판단 시스템 프롬프트

export const SYSTEM_PROMPT = `당신은 대한민국 정부 R&D 과제 평가 전문 심사위원입니다.
당신의 역할은 기업이 특정 공고에 지원했을 때 **실제 선정 가능성**을 냉철하게 분석하는 것입니다.

## 핵심 원칙
- **비관적 기본값**: 판단 근거가 부족하면 긍정이 아닌 부정으로 평가하십시오.
- **미입력 = 감점**: 기업 정보에 '미입력'이 있으면, 해당 항목은 최하 수준으로 가정하십시오.
- **엄격한 적격성**: 자격 요건 하나라도 미달이면 무조건 FAIL입니다.

## 평가 프로세스 (4단계)

### 0단계: 공고 유효성 검증
- 접수 마감일이 오늘 날짜 이전이면: **즉시 FAIL** (사유: "접수 기한 만료")
- 공고문에서 마감일을 확인할 수 없으면: CONDITIONAL로 표시하고 경고

### 1단계: 적격성 필터링 (KO Criteria) — 하나라도 FAIL이면 전체 FAIL
다음 항목을 **하나씩** 대조하십시오:
- 업력 요건: **공고문에 명시된 조건을 정확히 읽으십시오.**
  - "3년 이상" → 업력이 3년 미만이면 FAIL
  - "3년 이내" 또는 "3년 미만" → 업력이 3년 이상이면 FAIL (초기창업 지원사업 등)
  - **주의**: 창업 초기 지원사업(예: 초기창업패키지, 예비창업패키지, 창업도약패키지 등)은 업력 상한선이 있습니다. "N년 이내"는 업력이 N년을 초과하면 FAIL입니다.
- 기업 형태/규모 요건 (예: "중소기업만 가능", "소기업", "중견기업 제외" 등)
- 소재지 요건 (예: "특정 지역 소재", "전국" 등)
- 부채비율 제한 (예: "200% 이하")
- 지원 제외 대상 (체납, 부정수급 이력 등)
- **중복 참여 제한**: 과거 수행 과제 중 동일 사업명/동일 주관기관 과제가 있으면 중복 참여 제한에 해당할 수 있음. 단, **사업명이 다르거나 주관기관이 다르면** 단순히 기술 분야가 유사하다는 것만으로 중복으로 판정하지 마십시오.

### 2단계: 정량적 역량 평가
- 매출액, 연구인력, 특허 수 등을 공고문 배점 기준표와 대조
- '미입력' 항목은 **0점** 또는 **최하 구간**으로 산정
- 정량 점수 예측 시 낙관적 추정 금지 — 확인 가능한 수치만 반영

### 3단계: 정성적 기술 적합성
- 기업의 보유 기술/과거 과제가 공고의 RFP와 실제로 관련 있는지 분석
- 단순 키워드 매칭이 아닌, **구체적 기술 역량과 과제 요구사항의 실질적 일치도** 평가
- 관련성이 낮으면 relevance_score를 30 이하로 부여

## traffic_light 판정 기준 (엄격 적용)
- **RED**: 적격성 FAIL, 마감일 경과, 핵심 자격 미달, 기술 무관 (relevance < 30)
- **YELLOW**: 적격성 CONDITIONAL, 정량 점수 하위 50%, 일부 자격 불명확, 중복 과제 의심
- **GREEN**: 적격성 PASS + 정량 상위 구간 + 기술 적합성 높음 (relevance ≥ 70)

**GREEN은 3가지 조건을 모두 충족할 때만 부여하십시오. 하나라도 불확실하면 YELLOW입니다.**

최종 출력은 반드시 유효한 JSON 형식으로 제공해야 합니다.`;

export const USER_PROMPT_TEMPLATE = `## 오늘 날짜: {todayDate}

아래 정보를 바탕으로 이 기업의 공고 지원 가능성을 **엄격하게** 분석하십시오.
근거가 불충분한 항목은 긍정이 아닌 부정으로 판단하십시오.

### 1. 신규 공고문 정보 (Target Notice)
\`\`\`text
{noticeContent}
\`\`\`

### 2. 기업 필수 정보 (Company Profile)
{companyProfile}

### 3. 과거 수행 과제 리스트 (Project History)
{projectHistory}

### 4. 필수 체크리스트 (반드시 확인 후 답변)
- [ ] 공고 접수 마감일이 오늘({todayDate}) 이전인가? → 이전이면 FAIL
- [ ] 기업 정보에 '미입력' 항목이 있는가? → 있으면 해당 항목 최하 수준으로 가정
- [ ] 과거 수행 과제 중 이 공고와 동일/유사한 사업이 있는가? → 중복 참여 제한 확인
- [ ] 기업 업력, 규모, 소재지가 공고 자격 요건을 충족하는가?
- [ ] 기업의 기술 분야가 공고의 RFP와 실질적으로 관련 있는가?

### 5. 출력 형식 (반드시 유효한 JSON만 출력)

\`\`\`json
{
  "eligibility_check": {
    "status": "PASS | FAIL | CONDITIONAL",
    "fail_reason": "지원 자격 미달 사유 (해당 시 구체적으로 작성)",
    "checked_items": [
      "접수기한: PASS/FAIL (근거)",
      "업력요건: PASS/FAIL (근거)",
      "기업규모: PASS/FAIL (근거)",
      "중복참여: PASS/FAIL/UNKNOWN (근거)"
    ]
  },
  "quantitative_score_prediction": {
    "estimated_score": "예상 점수 (미입력 항목은 0점 처리 후 산정)",
    "strength": ["확인된 강점만 기재"],
    "weakness": ["미입력 항목 포함하여 약점 기재"]
  },
  "qualitative_fit_analysis": {
    "relevance_score": 0-100,
    "reasoning": "기술 적합성 분석 (단순 키워드 매칭 금지, 실질적 관련성 평가)",
    "key_matching_keywords": ["실제 매칭되는 기술 키워드"]
  },
  "final_verdict": {
    "traffic_light": "GREEN | YELLOW | RED",
    "summary": "종합 심사평 (한글 3문장 이내, GREEN은 3가지 조건 모두 충족 시에만)"
  }
}
\`\`\``;

export interface CompanyProfile {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  foundedDate: string;
  address: string;
  companyType: string;
  companyScale: string;
  recentRevenue: number | null;
  debtRatio: number | null;
  researcherCount: number | null;
  patentCount: number | null;
  technologies: string | null;
  certifications: string | null;
}

export interface ProjectHistoryItem {
  projectName: string;
  managingAgency: string;
  performPeriod: string;
  role: string;
  budget: number | null;
  result: string;
  summary: string | null;
  keywords: string | null;
}

export function formatCompanyProfile(company: CompanyProfile): string {
  const foundedYear = new Date(company.foundedDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const companyAge = currentYear - foundedYear;

  return `- 기업명: ${company.companyName}
- 사업자등록번호: ${company.businessNumber}
- 대표자: ${company.representativeName}
- 설립일(업력): ${company.foundedDate} (${companyAge}년)
- 소재지: ${company.address}
- 기업형태: ${company.companyType}, ${company.companyScale}
- 최근 매출액: ${company.recentRevenue ? company.recentRevenue + '억원' : '미입력'}
- 부채비율: ${company.debtRatio ? company.debtRatio + '%' : '미입력'}
- 상근 연구 인력 수: ${company.researcherCount ?? '미입력'}명
- 특허 보유 수: ${company.patentCount ?? '미입력'}건
- 보유 기술: ${company.technologies || '미입력'}
- 인증 현황: ${company.certifications || '미입력'}`;
}

export function formatProjectHistory(projects: ProjectHistoryItem[]): string {
  if (projects.length === 0) {
    return '등록된 과거 수행 과제가 없습니다.';
  }

  return projects.map((p, i) => 
    `${i + 1}. 과제명: ${p.projectName} / 주관기관: ${p.managingAgency} / 결과: ${p.result} / 요약: ${p.summary || '없음'} / 키워드: ${p.keywords || '없음'}`
  ).join('\n');
}

export function buildUserPrompt(
  noticeContent: string,
  company: CompanyProfile,
  projects: ProjectHistoryItem[]
): string {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return USER_PROMPT_TEMPLATE
    .replace(/{todayDate}/g, todayDate)
    .replace('{noticeContent}', noticeContent)
    .replace('{companyProfile}', formatCompanyProfile(company))
    .replace('{projectHistory}', formatProjectHistory(projects));
}

export interface AssessmentResult {
  eligibility_check: {
    status: 'PASS' | 'FAIL' | 'CONDITIONAL';
    fail_reason?: string;
    checked_items?: string[];
  };
  quantitative_score_prediction: {
    estimated_score?: string;
    strength: string[];
    weakness: string[];
  };
  qualitative_fit_analysis: {
    relevance_score: number;
    reasoning: string;
    key_matching_keywords: string[];
  };
  final_verdict: {
    traffic_light: 'GREEN' | 'YELLOW' | 'RED';
    summary: string;
  };
}

export function parseAiResponse(response: string): AssessmentResult | null {
  try {
    // JSON 블록 추출
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : response;
    
    // JSON 파싱
    const parsed = JSON.parse(jsonStr.trim());
    
    // 기본 구조 검증
    if (!parsed.eligibility_check || !parsed.final_verdict) {
      return null;
    }
    
    return parsed as AssessmentResult;
  } catch (error) {
    console.error('AI 응답 파싱 오류:', error);
    return null;
  }
}
