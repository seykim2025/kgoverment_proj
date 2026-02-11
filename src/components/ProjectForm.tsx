'use client';

import { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';

interface Project {
  id?: string;
  projectName: string;
  managingAgency: string;
  performPeriod: string;
  role: string;
  budget: number | null;
  result: string;
  summary: string | null;
  keywords: string | null;
}

interface ProjectFormProps {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

const initialFormData: Project = {
  projectName: '',
  managingAgency: '',
  performPeriod: '',
  role: '주관',
  budget: null,
  result: '진행중',
  summary: null,
  keywords: null,
};

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project || initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName) newErrors.projectName = '과제명을 입력하세요';
    if (!formData.managingAgency) newErrors.managingAgency = '주관기관을 입력하세요';
    if (!formData.performPeriod) newErrors.performPeriod = '수행기간을 입력하세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);

    try {
      const url = project?.id ? `/api/projects/${project.id}` : '/api/projects';
      const method = project?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        alert(data.error || '저장에 실패했습니다');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">과제명 <span style={{ color: 'var(--red-500)' }}>*</span></label>
        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange}
          placeholder="AI 기반 스마트팩토리 구축" className={`input ${errors.projectName ? 'input-error' : ''}`} />
        {errors.projectName && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.projectName}</p>}
      </div>

      <div>
        <label className="label">주관기관 <span style={{ color: 'var(--red-500)' }}>*</span></label>
        <input type="text" name="managingAgency" value={formData.managingAgency} onChange={handleChange}
          placeholder="중소벤처기업부" className={`input ${errors.managingAgency ? 'input-error' : ''}`} />
        {errors.managingAgency && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.managingAgency}</p>}
      </div>

      <div>
        <label className="label">수행기간 <span style={{ color: 'var(--red-500)' }}>*</span></label>
        <input type="text" name="performPeriod" value={formData.performPeriod} onChange={handleChange}
          placeholder="2023.01 ~ 2023.12" className={`input ${errors.performPeriod ? 'input-error' : ''}`} />
        {errors.performPeriod && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.performPeriod}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">역할 <span style={{ color: 'var(--red-500)' }}>*</span></label>
          <select name="role" value={formData.role} onChange={handleChange} className="input">
            <option value="주관">주관</option>
            <option value="참여">참여</option>
          </select>
        </div>
        <div>
          <label className="label">결과 <span style={{ color: 'var(--red-500)' }}>*</span></label>
          <select name="result" value={formData.result} onChange={handleChange} className="input">
            <option value="성공">성공</option>
            <option value="실패">실패</option>
            <option value="진행중">진행중</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">예산 (억원)</label>
        <input type="number" name="budget" value={formData.budget ?? ''} onChange={handleChange}
          step="0.1" placeholder="5.0" className="input" />
      </div>

      <div>
        <label className="label">요약</label>
        <textarea name="summary" value={formData.summary ?? ''} onChange={handleChange}
          rows={3} placeholder="과제 내용 요약..." className="input resize-none" />
      </div>

      <div>
        <label className="label">기술 키워드 (콤마로 구분)</label>
        <input type="text" name="keywords" value={formData.keywords ?? ''} onChange={handleChange}
          placeholder="AI, 머신러닝, 스마트팩토리" className="input" />
      </div>

      <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--gray-200)' }}>
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          <X className="w-4 h-4" />
          취소
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" />저장 중...</>
          ) : (
            <><Save className="w-4 h-4" />저장</>
          )}
        </button>
      </div>
    </form>
  );
}
