'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, Loader2, Wallet, Users, Award, CheckCircle } from 'lucide-react';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCompanyData();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) newErrors.businessNumber = '사업자등록번호 형식: 000-00-00000';
    if (!formData.companyName) newErrors.companyName = '회사명을 입력하세요';
    if (!formData.representativeName) newErrors.representativeName = '대표자명을 입력하세요';
    if (!formData.foundedDate) newErrors.foundedDate = '설립일을 입력하세요';
    if (!formData.address) newErrors.address = '소재지를 입력하세요';
    if (!formData.companyScale) newErrors.companyScale = '기업 규모를 선택하세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '회사 정보가 저장되었습니다' });
      } else {
        setMessage({ type: 'error', text: data.error || '저장에 실패했습니다' });
      }
    } catch (error) {
      console.error('저장 실패:', error);
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--blue-500)' }} />
        <span className="ml-3 text-[14px] font-medium" style={{ color: 'var(--gray-600)' }}>데이터 불러오는 중...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div className="p-4 rounded-xl flex items-center gap-3 animate-fade-in" style={{
          backgroundColor: message.type === 'success' ? 'var(--green-50)' : 'var(--red-50)',
          border: `1px solid ${message.type === 'success' ? 'var(--green-100)' : 'var(--red-100)'}`,
          color: message.type === 'success' ? 'var(--green-700)' : 'var(--red-700)',
        }}>
          {message.type === 'success' && <CheckCircle className="w-4 h-4" />}
          <span className="text-[14px]">{message.text}</span>
        </div>
      )}

      {/* 기본 정보 */}
      <div className="card p-6">
        <h3 className="text-[15px] font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
            <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--blue-500)' }} />
          </div>
          기본 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">사업자등록번호 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input type="text" name="businessNumber" value={formData.businessNumber} onChange={handleChange}
              placeholder="000-00-00000" className={`input ${errors.businessNumber ? 'input-error' : ''}`} />
            {errors.businessNumber && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.businessNumber}</p>}
          </div>
          <div>
            <label className="label">회사명 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
              placeholder="(주)회사명" className={`input ${errors.companyName ? 'input-error' : ''}`} />
            {errors.companyName && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.companyName}</p>}
          </div>
          <div>
            <label className="label">대표자명 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input type="text" name="representativeName" value={formData.representativeName} onChange={handleChange}
              placeholder="홍길동" className={`input ${errors.representativeName ? 'input-error' : ''}`} />
            {errors.representativeName && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.representativeName}</p>}
          </div>
          <div>
            <label className="label">설립일 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input type="date" name="foundedDate" value={formData.foundedDate} onChange={handleChange}
              className={`input ${errors.foundedDate ? 'input-error' : ''}`} />
            {errors.foundedDate && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.foundedDate}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="label">소재지 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              placeholder="서울특별시 강남구 테헤란로 123" className={`input ${errors.address ? 'input-error' : ''}`} />
            {errors.address && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* 기업 형태 */}
      <div className="card p-6">
        <h3 className="text-[15px] font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
            <Award className="w-3.5 h-3.5" style={{ color: 'var(--blue-500)' }} />
          </div>
          기업 형태
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">기업 유형 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <select name="companyType" value={formData.companyType} onChange={handleChange} className="input">
              <option value="법인">법인</option>
              <option value="개인">개인</option>
            </select>
          </div>
          <div>
            <label className="label">기업 규모 <span style={{ color: 'var(--red-500)' }}>*</span></label>
            <select name="companyScale" value={formData.companyScale} onChange={handleChange}
              className={`input ${errors.companyScale ? 'input-error' : ''}`}>
              <option value="">선택하세요</option>
              {companyScaleOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            {errors.companyScale && <p className="mt-1 text-[12px]" style={{ color: 'var(--red-500)' }}>{errors.companyScale}</p>}
          </div>
        </div>
      </div>

      {/* 재무 정보 */}
      <div className="card p-6">
        <h3 className="text-[15px] font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
            <Wallet className="w-3.5 h-3.5" style={{ color: 'var(--green-500)' }} />
          </div>
          재무 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">최근 매출액 (억원)</label>
            <input type="number" name="recentRevenue" value={formData.recentRevenue ?? ''} onChange={handleChange}
              step="0.1" placeholder="10.5" className="input" />
          </div>
          <div>
            <label className="label">부채비율 (%)</label>
            <input type="number" name="debtRatio" value={formData.debtRatio ?? ''} onChange={handleChange}
              step="0.1" placeholder="50.0" className="input" />
          </div>
        </div>
      </div>

      {/* 인력/역량 */}
      <div className="card p-6">
        <h3 className="text-[15px] font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--amber-50)' }}>
            <Users className="w-3.5 h-3.5" style={{ color: 'var(--amber-500)' }} />
          </div>
          인력 및 역량
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">상근 연구 인력 수</label>
            <input type="number" name="researcherCount" value={formData.researcherCount ?? ''} onChange={handleChange}
              min="0" placeholder="5" className="input" />
          </div>
          <div>
            <label className="label">특허 보유 수</label>
            <input type="number" name="patentCount" value={formData.patentCount ?? ''} onChange={handleChange}
              min="0" placeholder="3" className="input" />
          </div>
        </div>
      </div>

      {/* 기술 역량 */}
      <div className="card p-6">
        <h3 className="text-[15px] font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
            <Award className="w-3.5 h-3.5" style={{ color: 'var(--blue-500)' }} />
          </div>
          기술 역량
        </h3>
        <div className="space-y-4">
          <div>
            <label className="label">보유 기술 (콤마로 구분)</label>
            <textarea name="technologies" value={formData.technologies ?? ''} onChange={handleChange}
              rows={2} placeholder="AI, 머신러닝, 빅데이터, 클라우드" className="input resize-none" />
          </div>
          <div>
            <label className="label">인증 현황 (콤마로 구분)</label>
            <textarea name="certifications" value={formData.certifications ?? ''} onChange={handleChange}
              rows={2} placeholder="ISO 9001, 벤처기업인증, 이노비즈인증" className="input resize-none" />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" />저장 중...</>
          ) : (
            <><Save className="w-5 h-5" />저장하기</>
          )}
        </button>
      </div>
    </form>
  );
}
