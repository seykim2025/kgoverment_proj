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
          dotColor: 'bg-green-500',
          bgLight: 'bg-green-50',
          text: 'text-green-700',
          icon: CheckCircle2,
          label: '지원 추천'
        };
      case 'YELLOW':
        return {
          dotColor: 'bg-amber-500',
          bgLight: 'bg-amber-50',
          text: 'text-amber-700',
          icon: AlertCircle,
          label: '보완 필요'
        };
      case 'RED':
        return {
          dotColor: 'bg-red-500',
          bgLight: 'bg-red-50',
          text: 'text-red-700',
          icon: XCircle,
          label: '지원 불가'
        };
      default:
        return {
          dotColor: 'bg-gray-500',
          bgLight: 'bg-gray-100',
          text: 'text-gray-700',
          icon: AlertCircle,
          label: '미정'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-[14px] font-medium text-gray-600">데이터 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12 max-w-7xl mx-auto transition-all duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 mb-10 text-white shadow-2xl shadow-gray-200/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              안녕하세요, <span className="text-blue-400">김세용님</span> 👋
            </h1>
            <p className="text-gray-300 max-w-lg">
              AI가 분석한 과제 수행 가능성을 확인하고, 합격 확률이 높은 공고를 놓치지 마세요.
            </p>
          </div>
          <Link href="/assess" className="btn bg-white text-gray-900 hover:bg-blue-50 border-none shadow-lg hover:shadow-xl hover:-translate-y-1 px-6 py-3 h-auto text-[15px]">
            <Sparkles className="w-4 h-4 text-blue-600" />
            새 분석 시작하기
          </Link>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Empty State */}
      {assessments.length === 0 ? (
        <div className="card p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-white shadow-lg shadow-gray-100">
            <FileSearch className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">
            아직 분석 이력이 없습니다
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            관심 있는 정부과제 공고문을 업로드해보세요.<br />AI가 핵심 내용을 분석하고 적합성을 판단해드립니다.
          </p>
          <Link href="/assess" className="btn btn-primary btn-lg shadow-blue-500/30">
            <TrendingUp className="w-5 h-5" />
            첫 과제 분석하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total */}
            <div className="card p-6 relative overflow-hidden group hover:border-blue-200 bg-white">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="badge bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1">전체</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
                <p className="text-sm text-gray-500 font-medium">총 분석 건수</p>
              </div>
            </div>

            {/* Green */}
            <div className="card p-6 relative overflow-hidden group hover:border-green-200 bg-white">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-50 text-green-600 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="badge bg-green-50 text-green-600 border border-green-100 px-2.5 py-1">{getPercentage(stats.green, stats.total)}%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.green}</p>
                <p className="text-sm text-gray-500 font-medium">지원 추천</p>
              </div>
            </div>

            {/* Yellow */}
            <div className="card p-6 relative overflow-hidden group hover:border-amber-200 bg-white">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="badge bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1">{getPercentage(stats.yellow, stats.total)}%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.yellow}</p>
                <p className="text-sm text-gray-500 font-medium">보완 필요</p>
              </div>
            </div>

            {/* Red */}
            <div className="card p-6 relative overflow-hidden group hover:border-red-200 bg-white">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-600 group-hover:scale-110 transition-transform duration-300">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <span className="badge bg-red-50 text-red-600 border border-red-100 px-2.5 py-1">{getPercentage(stats.red, stats.total)}%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.red}</p>
                <p className="text-sm text-gray-500 font-medium">지원 불가</p>
              </div>
            </div>
          </div>

          {/* Chart + Ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Donut Chart */}
            <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-gray-900 self-start w-full">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-gray-600" />
                </div>
                판정 결과 분포
              </h3>

              <div className="relative w-64 h-64 mb-10">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F3F5" strokeWidth="12" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#40C057" strokeWidth="12"
                    strokeDasharray={`${getPercentage(stats.green, stats.total) * 2.51} 251`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FAB005" strokeWidth="12"
                    strokeDasharray={`${getPercentage(stats.yellow, stats.total) * 2.51} 251`}
                    strokeDashoffset={`${-getPercentage(stats.green, stats.total) * 2.51}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FA5252" strokeWidth="12"
                    strokeDasharray={`${getPercentage(stats.red, stats.total) * 2.51} 251`}
                    strokeDashoffset={`${-(getPercentage(stats.green, stats.total) + getPercentage(stats.yellow, stats.total)) * 2.51}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stats.total}</p>
                  <p className="text-sm font-medium text-gray-500 mt-1">TOTAL</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 w-full justify-center">
                {[
                  { label: '지원 추천', count: stats.green, color: 'bg-green-500' },
                  { label: '보완 필요', count: stats.yellow, color: 'bg-amber-500' },
                  { label: '지원 불가', count: stats.red, color: 'bg-red-500' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-1 group cursor-default">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm group-hover:scale-125 transition-transform`} />
                      <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Ranking */}
            <div className="card p-8 min-h-[400px]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                기술 적합성 TOP 5
              </h3>
              <div className="space-y-6">
                {assessments
                  .sort((a, b) => (b.qualitativeRelevanceScore || 0) - (a.qualitativeRelevanceScore || 0))
                  .slice(0, 5)
                  .map((assessment, idx) => (
                    <div key={assessment.id} className="group cursor-pointer">
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`
                          w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110
                          ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                            idx === 1 ? 'bg-gray-100 text-gray-700' :
                              idx === 2 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}
                        `}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {assessment.noticeTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-600">
                            {assessment.qualitativeRelevanceScore || 0}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">점</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${assessment.qualitativeRelevanceScore || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileSearch className="w-4 h-4 text-gray-600" />
                </div>
                최근 분석 결과
              </h3>
              <Link href="/history" className="btn btn-ghost text-sm font-medium hover:bg-gray-100 px-3 py-1.5 h-auto rounded-lg">
                전체보기 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {assessments.slice(0, 6).map((assessment, idx) => {
                const config = getTrafficLightConfig(assessment.trafficLight);
                const Icon = config.icon;

                return (
                  <div
                    key={assessment.id}
                    className="card group hover:-translate-y-1 transition-all duration-300 animate-fade-in-up bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`h-1.5 w-full ${config.dotColor}`} />

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${config.bgLight} ${config.text}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {config.label}
                        </div>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {formatDate(assessment.createdAt)}
                        </span>
                      </div>

                      <h4 className="text-[15px] font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors h-11">
                        {assessment.noticeTitle}
                      </h4>

                      {assessment.summary && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed h-10">
                          {assessment.summary}
                        </p>
                      )}

                      {assessment.qualitativeRelevanceScore !== null && (
                        <div className="pt-4 border-t border-gray-50">
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-500 font-medium">기술 적합성</span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              {assessment.qualitativeRelevanceScore}점
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500"
                              style={{ width: `${assessment.qualitativeRelevanceScore}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
