'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileSearch,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Calendar,
  Sparkles,
  Target,
  Award
} from "lucide-react";

interface Assessment {
  id: string;
  noticeTitle: string;
  eligibilityStatus: string;
  trafficLight: string;
  qualitativeRelevanceScore: number | null;
  summary: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  green: number;
  yellow: number;
  red: number;
}

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, green: 0, yellow: 0, red: 0 });

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const res = await fetch('/api/assess');
      const data = await res.json();

      if (res.ok && data.assessments) {
        setAssessments(data.assessments);

        const newStats: Stats = {
          total: data.assessments.length,
          green: data.assessments.filter((a: Assessment) => a.trafficLight === 'GREEN').length,
          yellow: data.assessments.filter((a: Assessment) => a.trafficLight === 'YELLOW').length,
          red: data.assessments.filter((a: Assessment) => a.trafficLight === 'RED').length,
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('판단 이력 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getTrafficLightConfig = (light: string) => {
    switch (light) {
      case 'GREEN':
        return {
          dotColor: 'bg-[var(--green-500)]',
          bgLight: 'bg-[var(--green-50)]',
          text: 'text-[var(--green-700)]',
          icon: CheckCircle2,
          label: '지원 추천'
        };
      case 'YELLOW':
        return {
          dotColor: 'bg-[var(--amber-500)]',
          bgLight: 'bg-[var(--amber-50)]',
          text: 'text-[var(--amber-700)]',
          icon: AlertCircle,
          label: '보완 필요'
        };
      case 'RED':
        return {
          dotColor: 'bg-[var(--red-500)]',
          bgLight: 'bg-[var(--red-50)]',
          text: 'text-[var(--red-700)]',
          icon: XCircle,
          label: '지원 불가'
        };
      default:
        return {
          dotColor: 'bg-[var(--gray-500)]',
          bgLight: 'bg-[var(--gray-100)]',
          text: 'text-[var(--gray-700)]',
          icon: AlertCircle,
          label: '미정'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: 'var(--blue-500)' }} />
          <p className="text-[14px] font-medium" style={{ color: 'var(--gray-600)' }}>데이터 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12 max-w-7xl mx-auto transition-all duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: 'var(--gray-900)' }}>
            대시보드
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'var(--gray-600)' }}>
            AI 판단 결과를 한눈에 확인하세요
          </p>
        </div>
        <Link href="/assess" className="btn btn-primary">
          <Sparkles className="w-4 h-4" />
          새 분석 시작
        </Link>
      </div>

      {/* Empty State */}
      {assessments.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--gray-100)' }}>
            <FileSearch className="w-10 h-10" style={{ color: 'var(--gray-400)' }} />
          </div>
          <h3 className="text-[18px] font-bold mb-2" style={{ color: 'var(--gray-900)' }}>
            아직 분석 이력이 없습니다
          </h3>
          <p className="text-[14px] mb-8 max-w-sm mx-auto" style={{ color: 'var(--gray-600)' }}>
            과제 공고문을 업로드하고 AI 분석을 실행하면
            여기에 결과가 표시됩니다.
          </p>
          <Link href="/assess" className="btn btn-primary btn-lg">
            <TrendingUp className="w-5 h-5" />
            첫 과제 분석하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total */}
            <div className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
                  <BarChart3 className="w-5 h-5" style={{ color: 'var(--blue-500)' }} />
                </div>
                <span className="badge badge-info">전체</span>
              </div>
              <p className="text-[28px] font-bold" style={{ color: 'var(--gray-900)' }}>{stats.total}</p>
              <p className="text-[13px]" style={{ color: 'var(--gray-600)' }}>총 분석 건수</p>
            </div>

            {/* Green */}
            <div className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--green-500)' }} />
                </div>
                <span className="badge badge-success">{getPercentage(stats.green, stats.total)}%</span>
              </div>
              <p className="text-[28px] font-bold" style={{ color: 'var(--green-500)' }}>{stats.green}</p>
              <p className="text-[13px]" style={{ color: 'var(--gray-600)' }}>지원 추천</p>
            </div>

            {/* Yellow */}
            <div className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-amber-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amber-50)' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--amber-500)' }} />
                </div>
                <span className="badge badge-warning">{getPercentage(stats.yellow, stats.total)}%</span>
              </div>
              <p className="text-[28px] font-bold" style={{ color: 'var(--amber-500)' }}>{stats.yellow}</p>
              <p className="text-[13px]" style={{ color: 'var(--gray-600)' }}>보완 필요</p>
            </div>

            {/* Red */}
            <div className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-red-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--red-50)' }}>
                  <XCircle className="w-5 h-5" style={{ color: 'var(--red-500)' }} />
                </div>
                <span className="badge badge-error">{getPercentage(stats.red, stats.total)}%</span>
              </div>
              <p className="text-[28px] font-bold" style={{ color: 'var(--red-500)' }}>{stats.red}</p>
              <p className="text-[13px]" style={{ color: 'var(--gray-600)' }}>지원 불가</p>
            </div>
          </div>

          {/* Chart + Ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Donut Chart */}
            <div className="card p-6">
              <h3 className="text-[15px] font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                <Target className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
                판정 결과 분포
              </h3>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gray-100)" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--green-500)" strokeWidth="12"
                      strokeDasharray={`${getPercentage(stats.green, stats.total) * 2.51} 251`}
                      strokeDashoffset="0"
                      className="transition-all duration-500" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--amber-500)" strokeWidth="12"
                      strokeDasharray={`${getPercentage(stats.yellow, stats.total) * 2.51} 251`}
                      strokeDashoffset={`${-getPercentage(stats.green, stats.total) * 2.51}`}
                      className="transition-all duration-500" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--red-500)" strokeWidth="12"
                      strokeDasharray={`${getPercentage(stats.red, stats.total) * 2.51} 251`}
                      strokeDashoffset={`${-(getPercentage(stats.green, stats.total) + getPercentage(stats.yellow, stats.total)) * 2.51}`}
                      className="transition-all duration-500" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[26px] font-bold" style={{ color: 'var(--gray-900)' }}>{stats.total}</p>
                    <p className="text-[12px]" style={{ color: 'var(--gray-500)' }}>총 분석</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2.5">
                {[
                  { label: '지원 추천', count: stats.green, color: 'var(--green-500)' },
                  { label: '보완 필요', count: stats.yellow, color: 'var(--amber-500)' },
                  { label: '지원 불가', count: stats.red, color: 'var(--red-500)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[13px]" style={{ color: 'var(--gray-700)' }}>{item.label}</span>
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--gray-900)' }}>
                      {item.count}건 ({getPercentage(item.count, stats.total)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Ranking */}
            <div className="card p-6">
              <h3 className="text-[15px] font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                <Award className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
                기술 적합성 TOP 5
              </h3>
              <div className="space-y-4">
                {assessments
                  .sort((a, b) => (b.qualitativeRelevanceScore || 0) - (a.qualitativeRelevanceScore || 0))
                  .slice(0, 5)
                  .map((assessment, idx) => (
                    <div key={assessment.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[12px]"
                        style={{
                          backgroundColor: idx === 0 ? 'var(--amber-50)' : idx === 1 ? 'var(--gray-100)' : idx === 2 ? 'var(--amber-50)' : 'var(--gray-50)',
                          color: idx === 0 ? 'var(--amber-600)' : 'var(--gray-600)',
                        }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--gray-900)' }}>
                          {assessment.noticeTitle}
                        </p>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gray-100)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${assessment.qualitativeRelevanceScore || 0}%`, backgroundColor: 'var(--blue-500)' }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-bold" style={{ color: 'var(--blue-500)' }}>
                          {assessment.qualitativeRelevanceScore || 0}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--gray-500)' }}>점</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                <FileSearch className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
                최근 분석 결과
              </h3>
              <span className="text-[13px]" style={{ color: 'var(--gray-500)' }}>
                총 {assessments.length}건
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assessments.slice(0, 6).map((assessment, idx) => {
                const config = getTrafficLightConfig(assessment.trafficLight);
                const Icon = config.icon;

                return (
                  <div
                    key={assessment.id}
                    className="card overflow-hidden hover:-translate-y-0.5 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className={`h-1 ${config.dotColor}`} />

                    <div className="p-5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3 ${config.bgLight} ${config.text}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </div>

                      <h4 className="text-[14px] font-semibold mb-2 line-clamp-2" style={{ color: 'var(--gray-900)' }}>
                        {assessment.noticeTitle}
                      </h4>

                      {assessment.summary && (
                        <p className="text-[13px] line-clamp-2 mb-4" style={{ color: 'var(--gray-600)' }}>
                          {assessment.summary}
                        </p>
                      )}

                      {assessment.qualitativeRelevanceScore !== null && (
                        <div className="mb-4">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span style={{ color: 'var(--gray-500)' }}>기술 적합성</span>
                            <span className="font-semibold" style={{ color: 'var(--blue-500)' }}>
                              {assessment.qualitativeRelevanceScore}점
                            </span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gray-100)' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${assessment.qualitativeRelevanceScore}%`, backgroundColor: 'var(--blue-500)' }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] pt-3" style={{ borderTop: '1px solid var(--gray-100)', color: 'var(--gray-500)' }}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(assessment.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {assessments.length > 6 && (
            <div className="text-center">
              <button className="btn btn-ghost">
                더 많은 분석 결과 보기 ({assessments.length - 6}건 더)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
