'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, FolderOpen, X } from 'lucide-react';
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
      case '성공': return 'badge-success';
      case '실패': return 'badge-error';
      case '진행중': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--blue-500)' }} />
        <span className="ml-3 text-[14px] font-medium" style={{ color: 'var(--gray-600)' }}>데이터 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--amber-50)', border: '1px solid var(--amber-100)' }}>
        <p className="text-[14px] font-medium" style={{ color: 'var(--amber-700)' }}>{error}</p>
        <p className="text-[13px] mt-2" style={{ color: 'var(--amber-600)' }}>먼저 회사 정보를 등록해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-[17px] font-semibold" style={{ color: 'var(--gray-900)' }}>
          수행 과제 목록 <span style={{ color: 'var(--blue-500)' }}>({projects.length}건)</span>
        </h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          새 과제 추가
        </button>
      </div>

      {/* 모달 폼 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" style={{ boxShadow: 'var(--shadow-xl)' }}>
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl" style={{ borderBottom: '1px solid var(--gray-200)' }}>
              <h3 className="text-[16px] font-semibold" style={{ color: 'var(--gray-900)' }}>
                {editingProject ? '과제 수정' : '새 과제 추가'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--gray-100)]"
                style={{ color: 'var(--gray-500)' }}
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
        <div className="border-2 border-dashed rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-300)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--gray-100)' }}>
            <FolderOpen className="w-8 h-8" style={{ color: 'var(--gray-400)' }} />
          </div>
          <h3 className="text-[16px] font-semibold mb-2" style={{ color: 'var(--gray-900)' }}>
            아직 등록된 과제가 없습니다
          </h3>
          <p className="text-[14px] mb-6 max-w-sm mx-auto" style={{ color: 'var(--gray-600)' }}>
            과거에 수행했던 정부과제를 등록하면 AI 판단의 정확도가 높아집니다.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            첫 과제 등록하기
          </button>
        </div>
      ) : (
        /* 테이블 */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--gray-50)' }}>
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-500)' }}>과제명</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-500)' }}>주관기관</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--gray-500)' }}>수행기간</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--gray-500)' }}>역할</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-500)' }}>결과</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-500)' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr 
                    key={project.id} 
                    className="transition-colors animate-fade-in hover:bg-[var(--gray-50)]"
                    style={{ animationDelay: `${index * 40}ms`, borderBottom: '1px solid var(--gray-100)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-[13px] font-medium" style={{ color: 'var(--gray-900)' }}>
                        {project.projectName}
                      </div>
                      {project.keywords && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {project.keywords.split(',').slice(0, 3).map((kw, i) => (
                            <span key={i} className="inline-block rounded px-2 py-0.5 text-[11px]"
                              style={{ backgroundColor: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: 'var(--gray-600)' }}>
                      {project.managingAgency}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] hidden md:table-cell" style={{ color: 'var(--gray-600)' }}>
                      {project.performPeriod}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`badge ${project.role === '주관' ? 'badge-info' : ''}`}
                        style={project.role !== '주관' ? { backgroundColor: 'var(--gray-100)', color: 'var(--gray-700)' } : undefined}>
                        {project.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${getResultBadgeClass(project.result)}`}>
                        {project.result}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingProject(project); setShowForm(true); }}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--blue-50)]"
                          style={{ color: 'var(--blue-500)' }}
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--red-50)]"
                          style={{ color: 'var(--red-500)' }}
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
