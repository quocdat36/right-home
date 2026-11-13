// src/components/ProgressHeader.tsx
'use client';

import { FlowStep } from '@/types/right-home';

interface Props {
  currentStep: FlowStep;
}

const STEP_META: Record<Exclude<FlowStep, 'landing'>, { index: number; label: string }> = {
  intake: { index: 1, label: 'Thông tin cơ bản' },
  swipe: { index: 2, label: 'Khám phá ưu tiên' },
  constraints: { index: 3, label: 'Điều kiện thực tế' },
  analyzing: { index: 4, label: 'Phân tích nhu cầu' },
  report: { index: 5, label: 'Hồ sơ ngôi nhà' },
};

export function ProgressHeader({ currentStep }: Props) {
  if (currentStep === 'landing') return null;

  const meta = STEP_META[currentStep];
  const progressPercent = (meta.index / 5) * 100;

  return (
    <header className="sticky top-0 z-30 bg-[#F2EBDD]/90 backdrop-blur-md border-b border-[#173A35]/10">
      <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-[0.18em] font-semibold text-[#173A35]">
          RIGHT HOME
        </span>
        <span className="text-xs font-medium tracking-wide uppercase text-[#24352F]/70">
          Bước {meta.index}/5 · {meta.label}
        </span>
      </div>
      <div className="w-full h-[2px] bg-[#173A35]/10">
        <div
          className="h-full bg-[#B18A4A] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}