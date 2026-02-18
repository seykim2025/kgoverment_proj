'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import {
  ChevronDown,
  Sparkles,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
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

// ... (interfaces remain the same)

export default function AssessPage() {
  const router = useRouter();
  const [uploadedDocument, setUploadedDocument] = useState<UploadResult | null>(null);


  // Analysis State
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'parsing' | 'analyzing' | 'scoring' | 'complete'>('idle');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');

  // Accordion State for Result
  const [openQualitative, setOpenQualitative] = useState(true);

  const handleUploadComplete = (uploadResult: UploadResult) => {
    setUploadedDocument(uploadResult);
    setResult(null);
    setError(null);
    setAnalysisStatus('idle');
  };

  const handleAnalyze = async (useManual: boolean = false) => {
    setAnalysisStatus('parsing');
    setError(null);
    setResult(null);

    // Simulate progress steps for better UX
    const timer1 = setTimeout(() => setAnalysisStatus('analyzing'), 1500);
    const timer2 = setTimeout(() => setAnalysisStatus('scoring'), 3500);

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
      setAnalysisStatus('complete');
    } catch (err) {
      setAnalysisStatus('idle');
      setError(err instanceof Error ? err.message : 'AI 분석 중 오류가 발생했습니다');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };



  const getTrafficLightStyles = (light: string) => {
    switch (light) {
      case 'GREEN': return { color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-100', icon: CheckCircle2, label: '지원 추천' };
      case 'YELLOW': return { color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-100', icon: AlertCircle, label: '보완 필요' };
      case 'RED': return { color: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-100', icon: XCircle, label: '지원 불가' };
      default: return { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: AlertCircle, label: '알 수 없음' };
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">과제 판단</h1>
        <p className="text-gray-600 mt-2">정부과제 공고문을 분석하여 지원 적합성을 판단합니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="card p-6 shadow-toss-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-primary-500" />
              공고문 업로드
            </h3>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onError={(uploadError) => setError(uploadError)}
            />
          </div>

          {/* Manual Input Toggle (Simplified) */}
          <div className="card p-6 shadow-toss-sm border border-gray-100">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-base font-semibold text-gray-900">직접 입력하기</h3>
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">과제명</label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="예: 2024년도 AI 바우처 지원사업"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">공고문 내용</label>
                  <textarea
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    placeholder="공고문 내용을 여기에 붙여넣으세요..."
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                  />
                </div>
                <button
                  onClick={() => handleAnalyze(true)}
                  disabled={analysisStatus !== 'idle' || !manualContent}
                  className="w-full btn btn-primary py-3"
                >
                  분석 시작
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Right Column: Status & Result */}
        <div className="space-y-6">
          {/* 1. Initial State / Text Preview */}
          {uploadedDocument && analysisStatus === 'idle' && !result && (
            <div className="card p-6 shadow-toss-sm border border-gray-100 animate-fade-in-up">
              <h3 className="text-lg font-bold mb-4 text-gray-900">문서 확인</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                  {uploadedDocument.parsed.text}
                </p>
              </div>
              <button
                onClick={() => handleAnalyze(false)}
                className="w-full btn btn-primary py-3 text-lg shadow-toss-md hover:shadow-toss-lg hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                AI 분석 시작하기
              </button>
            </div>
          )}

          {/* 2. Analysis Stepper */}
          {analysisStatus !== 'idle' && analysisStatus !== 'complete' && (
            <div className="card p-8 shadow-toss-medium border border-gray-100 text-center animate-fade-in">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI가 공고문을 분석하고 있어요</h3>
              <p className="text-gray-500 mb-8">잠시만 기다려주세요 (약 10~20초 소요)</p>

              <div className="max-w-xs mx-auto space-y-4">
                {/* Step 1 */}
                <div className={`flex items-center gap-3 transition-colors ${['parsing', 'analyzing', 'scoring'].includes(analysisStatus) ? 'text-primary-600' : 'text-gray-300'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${['parsing', 'analyzing', 'scoring'].includes(analysisStatus) ? 'bg-primary-500' : 'bg-gray-200'}`} />
                  <span className="font-medium text-sm">텍스트 구조화 및 파싱</span>
                </div>
                {/* Step 2 */}
                <div className={`flex items-center gap-3 transition-colors ${['analyzing', 'scoring'].includes(analysisStatus) ? 'text-primary-600' : 'text-gray-300'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${['analyzing', 'scoring'].includes(analysisStatus) ? 'bg-primary-500' : 'bg-gray-200'}`} />
                  <span className="font-medium text-sm">핵심 요건 추출 및 매칭</span>
                </div>
                {/* Step 3 */}
                <div className={`flex items-center gap-3 transition-colors ${['scoring'].includes(analysisStatus) ? 'text-primary-600' : 'text-gray-300'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${['scoring'].includes(analysisStatus) ? 'bg-primary-500' : 'bg-gray-200'}`} />
                  <span className="font-medium text-sm">적합성 점수 산출</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Error State */}
          {error && (
            <div className="card p-6 bg-danger-50 border border-danger-100 text-danger-900">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-danger-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">분석 실패</h3>
                  <p className="text-danger-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Result View */}
          {result && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Verdict Card */}
              {(() => {
                const styles = getTrafficLightStyles(result.final_verdict.traffic_light);
                const Icon = styles.icon;
                return (
                  <div className={`card p-6 border ${styles.border} ${styles.bg}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-white border ${styles.border} ${styles.color}`}>
                        <Icon className="w-4 h-4" />
                        {styles.label}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 ${styles.color}`}>종합 판정 결과</h3>
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {result.final_verdict.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Detail Cards */}
              <div className="card shadow-toss-sm border border-gray-100 overflow-hidden">
                {/* Eligibility */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">1. 자격 요건 검토</h4>
                  <div className={`rounded-xl p-4 border ${result.eligibility_check.status === 'PASS' ? 'bg-success-50 border-success-100 text-success-800' :
                    result.eligibility_check.status === 'FAIL' ? 'bg-danger-50 border-danger-100 text-danger-800' : 'bg-warning-50 border-warning-100 text-warning-800'
                    }`}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {result.eligibility_check.status === 'PASS' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      {result.eligibility_check.status === 'PASS' ? '적격 (PASS)' : result.eligibility_check.status === 'FAIL' ? '부적격 (FAIL)' : '검토 필요'}
                    </div>
                    {result.eligibility_check.fail_reason && (
                      <p className="pl-7 text-sm opacity-90">{result.eligibility_check.fail_reason}</p>
                    )}
                  </div>
                </div>

                {/* Qualitative Score */}
                <div className="p-6">
                  <button
                    onClick={() => setOpenQualitative(!openQualitative)}
                    className="w-full flex items-center justify-between group"
                  >
                    <h4 className="font-bold text-gray-900">2. 기술 적합성 분석</h4>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openQualitative ? 'rotate-180' : ''}`} />
                  </button>

                  {openQualitative && (
                    <div className="mt-4 animate-fade-in">
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold text-primary-600">{result.qualitative_fit_analysis.relevance_score}</span>
                        <span className="text-lg text-gray-500 mb-1">/ 100점</span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden mb-5">
                        <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${result.qualitative_fit_analysis.relevance_score}%` }} />
                      </div>

                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {result.qualitative_fit_analysis.reasoning}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {result.qualitative_fit_analysis.key_matching_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full btn btn-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3"
              >
                대시보드로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
