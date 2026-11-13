// src/components/AnalysisScreen.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  AnalysisReportData,
  CustomerIntakeData,
  PracticalConstraintsData,
  SwipeChoiceItem,
} from '@/types/right-home';

interface Props {
  idempotencyKey: string;
  intake: CustomerIntakeData;
  swipes: SwipeChoiceItem[];
  constraints: PracticalConstraintsData;
  report: AnalysisReportData;
  onSuccess: (submissionId: string, customerCode: string) => void;
}

const ANALYSIS_STAGES = [
  'Đang tổng hợp sở thích không gian sống.',
  'Đang phân loại mức độ ưu tiên.',
  'Đang đối chiếu ngân sách và điều kiện tài chính.',
  'Đang phân tích các yếu tố đánh đổi.',
  'Đang hoàn thiện hồ sơ nhu cầu nhà ở.',
];

export function AnalysisScreen({
  idempotencyKey,
  intake,
  swipes,
  constraints,
  report,
  onSuccess,
}: Props) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedMeta, setSavedMeta] = useState<{ id: string; code: string } | null>(null);
  const submittedOnceRef = useRef(false);

  const submitToBackend = async () => {
    setApiState('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          intake,
          swipes,
          constraints,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Không thể lưu hồ sơ lên máy chủ.');
      }
      setSavedMeta({ id: json.id, code: json.customerCode });
      setApiState('success');
    } catch (err) {
      setApiState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Kết nối máy chủ gián đoạn. Vui lòng thử lại.'
      );
    }
  };

  useEffect(() => {
    if (!submittedOnceRef.current) {
      submittedOnceRef.current = true;
      submitToBackend();
    }

    const interval = setInterval(() => {
      setElapsedMs((prev) => (prev >= 10000 ? 10000 : prev + 100));
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (elapsedMs >= 10000 && apiState === 'success' && savedMeta) {
      onSuccess(savedMeta.id, savedMeta.code);
    }
  }, [elapsedMs, apiState, savedMeta, onSuccess]);

  const stageIndex = Math.min(Math.floor(elapsedMs / 2000), 4);
  const progress = Math.round((elapsedMs / 10000) * 100);

  return (
    <div className="min-h-[82vh] bg-[#173A35] text-[#F2EBDD] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Vòng tròn tiến trình tối giản */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(242,235,221,0.12)"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#B18A4A"
              strokeWidth="3"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-150 ease-linear"
            />
          </svg>
          <span className="absolute font-serif text-2xl text-white font-semibold">
            {progress}%
          </span>
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-3">
            RIGHT HOME đang phân tích nhu cầu của bạn...
          </h2>
          <p className="text-sm sm:text-base text-[#B18A4A] min-h-[24px] transition-opacity">
            {elapsedMs >= 10000 && apiState === 'loading'
              ? 'Đang hoàn tất lưu trữ hồ sơ lên hệ thống...'
              : ANALYSIS_STAGES[stageIndex]}
          </p>
        </div>

        {/* Các chỉ số thực tế tính từ câu trả lời */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5">
            <p className="font-serif text-2xl text-white">{report.stats.totalEvaluated}</p>
            <p className="text-[11px] text-[#F2EBDD]/70 mt-1">Tiêu chí đã xác định</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5">
            <p className="font-serif text-2xl text-[#B18A4A]">{report.stats.priorityCount}</p>
            <p className="text-[11px] text-[#F2EBDD]/70 mt-1">Ưu tiên nổi bật</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5">
            <p className="font-serif text-2xl text-white">{report.stats.constraintsCount}</p>
            <p className="text-[11px] text-[#F2EBDD]/70 mt-1">Điều kiện thực tế</p>
          </div>
        </div>

        {/* Trạng thái lỗi trung thực nếu Backend chưa kết nối hoặc gặp sự cố */}
        {apiState === 'error' && (
          <div className="bg-red-950/60 border border-red-400/40 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-start gap-2.5 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={submitToBackend}
              className="inline-flex items-center gap-2 bg-[#B18A4A] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Thử lưu lại hồ sơ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}