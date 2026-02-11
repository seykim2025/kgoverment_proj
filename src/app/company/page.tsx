import CompanyForm from "@/components/CompanyForm";
import { Info } from "lucide-react";

export default function CompanyPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold" style={{ color: 'var(--gray-900)' }}>
          회사 정보
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--gray-600)' }}>
          정부과제 수행 가능성 판단에 필요한 회사 정보를 입력해주세요.
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--blue-100)' }}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--blue-500)' }} />
        <div className="text-[13px]" style={{ color: 'var(--blue-700)' }}>
          <p className="font-medium mb-0.5" style={{ color: 'var(--blue-700)' }}>정확한 정보 입력이 중요합니다</p>
          <p>입력하신 정보는 AI 분석의 기초 자료로 활용됩니다. 정확한 정보를 입력할수록 더 정확한 판단 결과를 얻을 수 있습니다.</p>
        </div>
      </div>

      <CompanyForm />
    </div>
  );
}
