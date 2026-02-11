import ProjectList from "@/components/ProjectList";
import { Info } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold" style={{ color: 'var(--gray-900)' }}>
          과제 이력
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--gray-600)' }}>
          과거에 수행했던 정부과제 이력을 관리합니다. AI 판단의 정확도를 높이기 위해 상세히 입력해주세요.
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: 'var(--amber-50)', border: '1px solid var(--amber-100)' }}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--amber-500)' }} />
        <div className="text-[13px]" style={{ color: 'var(--amber-700)' }}>
          <p className="font-medium mb-0.5">과제 이력이 많을수록 좋습니다</p>
          <p>과거 수행 과제 이력을 등록하면 AI가 회사의 역량과 경험을 더 정확히 분석할 수 있습니다. 성공적으로 완료한 과제뿐만 아니라 진행 중인 과제도 등록해주세요.</p>
        </div>
      </div>

      <ProjectList />
    </div>
  );
}
