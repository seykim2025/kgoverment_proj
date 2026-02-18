'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, FolderOpen, X, Search, Filter } from 'lucide-react';
import ProjectForm from './ProjectForm';

interface Project {
  id: string;
  projectName: string;
  managingAgency: string;
  performPeriod: string;
  role: string;
  budget: number | null;
  result: string;
  summary: string | null;
  keywords: string | null;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('ALL'); // ALL, 성공, 실패, 진행중, 기타

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('과제 이력 로딩 실패:', err);
      setError('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingProject(null);
    loadProjects();
  };

  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case '성공': return 'bg-success-100 text-success-700';
      case '실패': return 'bg-danger-100 text-danger-700';
      case '진행중': return 'bg-warning-100 text-warning-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter Logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.managingAgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.keywords && project.keywords.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterResult === 'ALL' || project.result === filterResult;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-3 text-sm font-medium text-gray-600">데이터 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-6 text-center border border-amber-100 bg-amber-50">
        <p className="text-sm font-medium text-amber-700">{error}</p>
        <p className="text-xs mt-2 text-amber-600">먼저 회사 정보를 등록해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 & 툴바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            수행 과제 목록 <span className="text-primary-500">({filteredProjects.length}건)</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="과제명, 기관, 키워드 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 transition-shadow"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white w-full sm:w-auto cursor-pointer transition-shadow"
            >
              <option value="ALL">전체 결과</option>
              <option value="성공">성공</option>
              <option value="진행중">진행중</option>
              <option value="실패">실패</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            새 과제 추가
          </button>
        </div>
      </div>

      {/* 모달 폼 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up shadow-toss-xl">
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl border-b border-gray-100 z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProject ? '과제 수정' : '새 과제 추가'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProjectForm
                project={editingProject}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {projects.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white border border-gray-100 shadow-sm">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold mb-2 text-gray-900">
            아직 등록된 과제가 없습니다
          </h3>
          <p className="text-sm mb-6 max-w-sm mx-auto text-gray-600">
            과거에 수행했던 정부과제를 등록하면 AI 판단의 정확도가 높아집니다.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            첫 과제 등록하기
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card p-12 text-center border-gray-100">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        /* 테이블 */
        <div className="card overflow-hidden border border-gray-100 shadow-toss-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">과제명</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">주관기관</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">수행기간</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">역할</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">결과</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project.projectName}
                      </div>
                      {project.keywords && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {project.keywords.split(',').slice(0, 3).map((kw, i) => (
                            <span key={i} className="inline-block rounded px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {project.managingAgency}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {project.performPeriod}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${project.role === '주관' ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                        {project.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getResultBadgeClass(project.result)}`}>
                        {project.result}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingProject(project); setShowForm(true); }}
                          className="p-2 rounded-lg transition-colors hover:bg-blue-50 text-blue-500"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-50 text-red-500"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
