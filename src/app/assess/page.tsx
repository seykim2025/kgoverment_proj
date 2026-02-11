'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FileText, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface ParsedDocument {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    creationDate?: string;
  };
}

interface UploadResult {
  success: boolean;
  fileName: string;
  filePath: string;
  fileSize: number;
  parsed: ParsedDocument;
}

interface RecentUpload {
  id: string;
  fileName: string;
  uploadedAt: Date;
  numPages: number;
}

interface AssessmentResult {
  eligibility_check: {
    status: 'PASS' | 'FAIL' | 'CONDITIONAL';
    fail_reason?: string;
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

export default function AssessPage() {
  const router = useRouter();
  const [uploadedDocument, setUploadedDocument] = useState<UploadResult | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');

  const handleUploadComplete = (uploadResult: UploadResult) => {
    setUploadedDocument(uploadResult);
    setResult(null);
    setError(null);
    
    const newUpload: RecentUpload = {
      id: Date.now().toString(),
      fileName: uploadResult.fileName,
      uploadedAt: new Date(),
      numPages: uploadResult.parsed.numPages,
    };
    setRecentUploads(prev => [newUpload, ...prev].slice(0, 5));
  };

  const handleAnalyze = async (useManual: boolean = false) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const noticeTitle = useManual ? manualTitle : (uploadedDocument?.parsed.info.title || uploadedDocument?.fileName || '공고문');
      const noticeContent = useManual ? manualContent : uploadedDocument?.parsed.text;
      const pdfPath = useManual ? undefined : uploadedDocument?.filePath;

      if (!noticeContent || noticeContent.length < 10) {
        throw new Error('분석할 내용이 없습니다. PDF를 업로드하거나 내용을 입력해주세요.');
      }

      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeTitle, noticeContent, pdfPath }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI 분석에 실패했습니다');
      }

      setResult(data.assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 분석 중 오류가 발생했습니다');
    } finally {
      setAnalyzing(false);
    }
  };

  const getTextPreview = (text: string, maxLength: number = 500): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getTrafficLightStyles = (light: string) => {
    switch (light) {
      case 'GREEN': return { color: 'var(--green-500)', bg: 'var(--green-50)', icon: CheckCircle2, label: '지원 추천' };
      case 'YELLOW': return { color: 'var(--amber-500)', bg: 'var(--amber-50)', icon: AlertCircle, label: '보완 필요' };
      case 'RED': return { color: 'var(--red-500)', bg: 'var(--red-50)', icon: XCircle, label: '지원 불가' };
      default: return { color: 'var(--gray-500)', bg: 'var(--gray-100)', icon: AlertCircle, label: '알 수 없음' };
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold" style={{ color: 'var(--gray-900)' }}>
          과제 판단
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--gray-600)' }}>
          정부과제 공고문을 업로드하거나 입력하면 AI가 수행 가능성을 분석합니다.
        </p>
      </div>

      <div className="space-y-5">
        {/* PDF Upload */}
        <div className="card p-6">
          <h3 className="text-[15px] font-semibold mb-1.5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
            <FileText className="w-4 h-4" style={{ color: 'var(--blue-500)' }} />
            과제공고 PDF 업로드
          </h3>
          <p className="text-[13px] mb-5" style={{ color: 'var(--gray-600)' }}>
            정부과제 공고 PDF 파일을 업로드하면 자동으로 텍스트를 추출하여 분석합니다.
          </p>
          
          <FileUpload 
            onUploadComplete={handleUploadComplete}
            onError={(uploadError) => setError(uploadError)}
          />
        </div>

        {/* Parsed Text Preview */}
        {uploadedDocument && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-semibold flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--green-500)' }} />
                추출된 텍스트 미리보기
              </h3>
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="flex items-center gap-1 text-[13px] font-medium transition-colors"
                style={{ color: 'var(--blue-500)' }}
              >
                {isTextExpanded ? (
                  <>접기 <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>펼치기 <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>

            <div 
              className={`rounded-xl p-4 overflow-auto transition-all duration-300 ${
                isTextExpanded ? 'max-h-[600px]' : 'max-h-[200px]'
              }`}
              style={{ backgroundColor: 'var(--gray-50)' }}
            >
              <pre className="text-[13px] whitespace-pre-wrap font-[inherit] leading-relaxed" style={{ color: 'var(--gray-700)' }}>
                {isTextExpanded 
                  ? uploadedDocument.parsed.text 
                  : getTextPreview(uploadedDocument.parsed.text)
                }
              </pre>
            </div>

            <div className="mt-4 flex justify-between items-center text-[13px]" style={{ color: 'var(--gray-500)' }}>
              <span>총 {uploadedDocument.parsed.text.length.toLocaleString()}자</span>
              <span>{uploadedDocument.parsed.numPages}페이지</span>
            </div>

            <button
              onClick={() => handleAnalyze(false)}
              disabled={analyzing}
              className="mt-5 w-full btn btn-primary btn-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  AI 분석 시작
                </>
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-4 flex items-start gap-3 animate-fade-in" style={{ backgroundColor: 'var(--red-50)', border: '1px solid var(--red-100)' }}>
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--red-500)' }} />
            <div>
              <h4 className="text-[14px] font-medium" style={{ color: 'var(--red-700)' }}>오류 발생</h4>
              <p className="text-[13px] mt-1" style={{ color: 'var(--red-600)' }}>{error}</p>
            </div>
          </div>
        )}

        {/* AI Result */}
        {result && (
          <div className="card overflow-hidden animate-fade-in-up">
            {/* Traffic Light Header */}
            {(() => {
              const styles = getTrafficLightStyles(result.final_verdict.traffic_light);
              const Icon = styles.icon;
              return (
                <div className="p-6 text-white" style={{ backgroundColor: styles.color }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-[22px] font-bold">{styles.label}</h3>
                      <p className="text-white/90 mt-1 text-[14px]">{result.final_verdict.summary}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-6 space-y-6">
              {/* Eligibility */}
              <div>
                <h4 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                  <span className="w-2 h-2 rounded-full" style={{
                    backgroundColor: result.eligibility_check.status === 'PASS' ? 'var(--green-500)' : 
                      result.eligibility_check.status === 'FAIL' ? 'var(--red-500)' : 'var(--amber-500)'
                  }} />
                  적격성 필터링
                </h4>
                <div className="p-4 rounded-xl" style={{
                  backgroundColor: result.eligibility_check.status === 'PASS' ? 'var(--green-50)' : 
                    result.eligibility_check.status === 'FAIL' ? 'var(--red-50)' : 'var(--amber-50)',
                  border: `1px solid ${result.eligibility_check.status === 'PASS' ? 'var(--green-100)' :
                    result.eligibility_check.status === 'FAIL' ? 'var(--red-100)' : 'var(--amber-100)'}`
                }}>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{
                    color: result.eligibility_check.status === 'PASS' ? 'var(--green-700)' :
                      result.eligibility_check.status === 'FAIL' ? 'var(--red-700)' : 'var(--amber-700)'
                  }}>
                    {result.eligibility_check.status === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
                    {result.eligibility_check.status === 'FAIL' && <XCircle className="w-4 h-4" />}
                    {result.eligibility_check.status === 'CONDITIONAL' && <AlertCircle className="w-4 h-4" />}
                    {result.eligibility_check.status === 'PASS' ? '적격' : 
                     result.eligibility_check.status === 'FAIL' ? '부적격' : '조건부 적격'}
                  </span>
                  {result.eligibility_check.fail_reason && (
                    <p className="text-[13px] mt-2" style={{ color: 'var(--gray-700)' }}>{result.eligibility_check.fail_reason}</p>
                  )}
                </div>
              </div>

              {/* Quantitative */}
              <div>
                <h4 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--gray-900)' }}>정량적 역량 평가</h4>
                {result.quantitative_score_prediction.estimated_score && (
                  <p className="text-[16px] font-semibold mb-4" style={{ color: 'var(--blue-500)' }}>
                    예상 점수: {result.quantitative_score_prediction.estimated_score}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--green-50)', border: '1px solid var(--green-100)' }}>
                    <h5 className="text-[13px] font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--green-700)' }}>
                      <TrendingUp className="w-4 h-4" />
                      강점
                    </h5>
                    <ul className="text-[13px] space-y-2" style={{ color: 'var(--green-700)' }}>
                      {result.quantitative_score_prediction.strength.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--red-50)', border: '1px solid var(--red-100)' }}>
                    <h5 className="text-[13px] font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--red-700)' }}>
                      <AlertCircle className="w-4 h-4" />
                      약점
                    </h5>
                    <ul className="text-[13px] space-y-2" style={{ color: 'var(--red-700)' }}>
                      {result.quantitative_score_prediction.weakness.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Qualitative */}
              <div>
                <h4 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--gray-900)' }}>정성적 기술 적합성</h4>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--blue-100)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-[26px] font-bold" style={{ color: 'var(--blue-500)' }}>
                      {result.qualitative_fit_analysis.relevance_score}점
                    </div>
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--blue-100)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${result.qualitative_fit_analysis.relevance_score}%`, backgroundColor: 'var(--blue-500)' }} />
                    </div>
                  </div>
                  <p className="text-[13px] mb-4" style={{ color: 'var(--gray-700)' }}>{result.qualitative_fit_analysis.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.qualitative_fit_analysis.key_matching_keywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-[12px] font-medium"
                        style={{ backgroundColor: 'var(--blue-100)', color: 'var(--blue-700)' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Go to Dashboard */}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full btn btn-secondary btn-lg"
              >
                대시보드에서 전체 이력 보기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Manual Input */}
        <div className="card p-6">
          <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: 'var(--gray-900)' }}>
            수동 입력 (선택사항)
          </h3>
          <p className="text-[13px] mb-5" style={{ color: 'var(--gray-600)' }}>
            PDF 업로드 대신 직접 과제 정보를 입력할 수도 있습니다.
          </p>

          <div className="space-y-4">
            <div>
              <label className="label">과제명</label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="과제명을 입력하세요"
                className="input"
              />
            </div>

            <div>
              <label className="label">과제 내용 / 공고문 전문</label>
              <textarea
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="과제 내용이나 공고문 전문을 입력하세요..."
                rows={8}
                className="input resize-none"
              />
            </div>

            <button
              onClick={() => handleAnalyze(true)}
              disabled={analyzing || !manualContent}
              className="w-full btn btn-secondary btn-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  수동 입력으로 분석
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <div className="card p-6">
            <h3 className="text-[15px] font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
              최근 업로드된 공고문
            </h3>
            <ul className="divide-y" style={{ borderColor: 'var(--gray-100)' }}>
              {recentUploads.map((upload) => (
                <li 
                  key={upload.id}
                  className="py-3 flex justify-between items-center px-3 -mx-3 rounded-lg transition-colors hover:bg-[var(--gray-50)]"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" style={{ color: 'var(--gray-400)' }} />
                    <span className="text-[14px] font-medium" style={{ color: 'var(--gray-800)' }}>{upload.fileName}</span>
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--gray-500)' }}>
                    {upload.numPages}페이지 · {upload.uploadedAt.toLocaleTimeString('ko-KR')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
