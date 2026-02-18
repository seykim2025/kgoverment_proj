'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, Loader2, Wallet, Users, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface CompanyData {
  id?: string;
  businessNumber: string;
  companyName: string;
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

const initialFormData: CompanyData = {
  businessNumber: '',
  companyName: '',
  representativeName: '',
  foundedDate: '',
  address: '',
  companyType: '법인',
  companyScale: '',
  recentRevenue: null,
  debtRatio: null,
  researcherCount: null,
  patentCount: null,
  technologies: null,
  certifications: null,
};

const companyScaleOptions = [
  '중소기업', '중견기업', '대기업', '벤처기업', '이노비즈', '메인비즈', '스타트업',
];

export default function CompanyForm() {
  const [formData, setFormData] = useState<CompanyData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string; visible: boolean } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCompanyData();
  }, []);

  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company');
      const data = await res.json();
      if (data.company) {
        setFormData({
          ...data.company,
          foundedDate: data.company.foundedDate?.split('T')[0] || '',
        });
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      showToast('error', '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text, visible: true });
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'businessNumber':
        return !/^\d{3}-\d{2}-\d{5}$/.test(value) ? '사업자등록번호 형식: 000-00-00000' : '';
      case 'companyName':
        return !value ? '회사명을 입력하세요' : '';
      case 'representativeName':
        return !value ? '대표자명을 입력하세요' : '';
      case 'foundedDate':
        return !value ? '설립일을 입력하세요' : '';
      case 'address':
        return !value ? '소재지를 입력하세요' : '';
      case 'companyScale':
        return !value ? '기업 규모를 선택하세요' : '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof CompanyData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('error', '입력 정보를 확인해주세요.');
      // Shake effect logic could go here
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', '회사 정보가 성공적으로 저장되었습니다.');
      } else {
        showToast('error', data.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      showToast('error', '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value ? parseFloat(value) : null) : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Clear error immediately on change if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-3 text-sm font-medium text-gray-600">데이터 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${toast?.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        {toast && (
          <div className={`p-4 rounded-xl shadow-toss-lg flex items-center gap-3 border ${toast.type === 'success' ? 'bg-success-50 border-success-100 text-success-800' : 'bg-danger-50 border-danger-100 text-danger-800'
            }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.text}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="card p-6 shadow-toss-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
              <Building2 className="w-5 h-5" />
            </div>
            기본 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">사업자등록번호 <span className="text-danger-500">*</span></label>
              <input
                type="text"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="000-00-00000"
                className={`input ${errors.businessNumber ? 'input-error' : ''}`}
              />
              {errors.businessNumber && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.businessNumber}</p>}
            </div>
            <div className="form-control">
              <label className="label">회사명 <span className="text-danger-500">*</span></label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="(주)회사명"
                className={`input ${errors.companyName ? 'input-error' : ''}`}
              />
              {errors.companyName && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.companyName}</p>}
            </div>
            <div className="form-control">
              <label className="label">대표자명 <span className="text-danger-500">*</span></label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="홍길동"
                className={`input ${errors.representativeName ? 'input-error' : ''}`}
              />
              {errors.representativeName && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.representativeName}</p>}
            </div>
            <div className="form-control">
              <label className="label">설립일 <span className="text-danger-500">*</span></label>
              <input
                type="date"
                name="foundedDate"
                value={formData.foundedDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${errors.foundedDate ? 'input-error' : ''}`}
              />
              {errors.foundedDate && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.foundedDate}</p>}
            </div>
            <div className="md:col-span-2 form-control">
              <label className="label">소재지 <span className="text-danger-500">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="서울특별시 강남구 테헤란로 123"
                className={`input ${errors.address ? 'input-error' : ''}`}
              />
              {errors.address && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* 기업 형태 */}
        <div className="card p-6 shadow-toss-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <Award className="w-5 h-5" />
            </div>
            기업 형태
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">기업 유형 <span className="text-danger-500">*</span></label>
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
              >
                <option value="법인">법인</option>
                <option value="개인">개인</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">기업 규모 <span className="text-danger-500">*</span></label>
              <select
                name="companyScale"
                value={formData.companyScale}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${errors.companyScale ? 'input-error' : ''}`}
              >
                <option value="">선택하세요</option>
                {companyScaleOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              {errors.companyScale && <p className="text-xs text-danger-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.companyScale}</p>}
            </div>
          </div>
        </div>

        {/* 재무 정보 */}
        <div className="card p-6 shadow-toss-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
              <Wallet className="w-5 h-5" />
            </div>
            재무 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">최근 매출액 (억원)</label>
              <input
                type="number"
                name="recentRevenue"
                value={formData.recentRevenue ?? ''}
                onChange={handleChange}
                step="0.1"
                placeholder="10.5"
                className="input"
              />
            </div>
            <div className="form-control">
              <label className="label">부채비율 (%)</label>
              <input
                type="number"
                name="debtRatio"
                value={formData.debtRatio ?? ''}
                onChange={handleChange}
                step="0.1"
                placeholder="50.0"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 인력/역량 */}
        <div className="card p-6 shadow-toss-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Users className="w-5 h-5" />
            </div>
            인력 및 역량
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">상근 연구 인력 수</label>
              <input
                type="number"
                name="researcherCount"
                value={formData.researcherCount ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="5"
                className="input"
              />
            </div>
            <div className="form-control">
              <label className="label">특허 보유 수</label>
              <input
                type="number"
                name="patentCount"
                value={formData.patentCount ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="3"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 기술 역량 */}
        <div className="card p-6 shadow-toss-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Award className="w-5 h-5" />
            </div>
            기술 역량
          </h3>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">보유 기술 (콤마로 구분)</label>
              <textarea
                name="technologies"
                value={formData.technologies ?? ''}
                onChange={handleChange}
                rows={2}
                placeholder="AI, 머신러닝, 빅데이터, 클라우드"
                className="input resize-none"
              />
            </div>
            <div className="form-control">
              <label className="label">인증 현황 (콤마로 구분)</label>
              <textarea
                name="certifications"
                value={formData.certifications ?? ''}
                onChange={handleChange}
                rows={2}
                placeholder="ISO 9001, 벤처기업인증, 이노비즈인증"
                className="input resize-none"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end sticky bottom-6 z-10">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg shadow-toss-lg hover:-translate-y-0.5 transition-transform"
          >
            {saving ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" />저장 중...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" />저장하기</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
