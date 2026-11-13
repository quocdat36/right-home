// src/components/ReportScreen.tsx
'use client';

import { useState } from 'react';
import { CheckCircle2, Compass, MinusCircle, Scale, X } from 'lucide-react';
import { AnalysisReportData, SwipeChoiceItem } from '@/types/right-home';

interface Props {
  submissionId: string;
  customerCode: string;
  customerName: string;
  report: AnalysisReportData;
  swipes: SwipeChoiceItem[];
}

export function ReportScreen({
  submissionId,
  customerCode,
  customerName,
  report,
  swipes,
}: Props) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [consultStatus, setConsultStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleRequestConsult = async () => {
    setConsultStatus('loading');
    try {
      const res = await fetch(`/api/submissions/${submissionId}/consultation`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error();
      setConsultStatus('done');
    } catch {
      setConsultStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12 space-y-6">
      {/* Tiêu đề */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B18A4A] font-semibold">
          Mã hồ sơ: {customerCode} · Dành cho {customerName}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#173A35] font-semibold leading-tight">
          Đây là chân dung ngôi nhà bạn đang tìm kiếm.
        </h2>
      </div>

      {/* Phần 1 — Hồ sơ nhu cầu */}
      <section className="bg-[#173A35] text-[#F2EBDD] rounded-2xl p-6 sm:p-7 shadow-md">
        <h3 className="text-xs uppercase tracking-[0.18em] text-[#B18A4A] font-semibold mb-4">
          Phần 1 · Hồ sơ nhu cầu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div>
            <span className="text-[#F2EBDD]/60 block text-xs">Nhóm khách hàng</span>
            <span className="font-medium text-white">{report.customerProfile.segmentLabel}</span>
          </div>
          <div>
            <span className="text-[#F2EBDD]/60 block text-xs">Mục đích</span>
            <span className="font-medium text-white">{report.customerProfile.intent}</span>
          </div>
          <div>
            <span className="text-[#F2EBDD]/60 block text-xs">Ngân sách</span>
            <span className="font-medium text-white">{report.customerProfile.budgetLabel}</span>
          </div>
          <div>
            <span className="text-[#F2EBDD]/60 block text-xs">Nhu cầu không gian</span>
            <span className="font-medium text-white">
              {report.customerProfile.bedrooms} · {report.customerProfile.areaLabel}
            </span>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-white/10">
            <span className="text-[#F2EBDD]/60 block text-xs">Phương án tài chính</span>
            <span className="font-medium text-white">{report.customerProfile.financialSummary}</span>
          </div>
        </div>
      </section>

      {/* Phần 2 — Ba ưu tiên nổi bật */}
      <section className="bg-white rounded-2xl p-6 border border-[#173A35]/10">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-[#173A35]" />
          <h3 className="font-serif text-xl text-[#173A35] font-semibold">
            Ba ưu tiên nổi bật của bạn
          </h3>
        </div>
        {report.topPriorities.length > 0 ? (
          <ul className="space-y-2.5">
            {report.topPriorities.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm bg-[#F2EBDD]/40 px-4 py-3 rounded-xl"
              >
                <span className="font-serif font-bold text-[#B18A4A]">0{idx + 1}</span>
                <span className="font-medium text-[#24352F]">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#24352F]/70">
            Bạn chưa đánh dấu ưu tiên cụ thể nào. Bạn có thể xem lại các thẻ để chọn thêm.
          </p>
        )}
      </section>

      {/* Phần 3 — Những điều không ưu tiên */}
      <section className="bg-white rounded-2xl p-6 border border-[#173A35]/10">
        <div className="flex items-center gap-2 mb-3">
          <MinusCircle className="w-5 h-5 text-[#24352F]/60" />
          <h3 className="font-serif text-xl text-[#173A35] font-semibold">
            Những yếu tố bạn sẵn sàng lược bỏ
          </h3>
        </div>
        {report.notPriorities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {report.notPriorities.slice(0, 8).map((item, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F2EBDD]/60 text-[#24352F]/80"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#24352F]/70">Chưa có yếu tố nào bị loại trừ hoàn toàn.</p>
        )}
      </section>

      {/* Phần 4 — Những yếu tố cần cân nhắc */}
      <section className="bg-[#F2EBDD] rounded-2xl p-6 border border-[#B18A4A]/40">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-[#B18A4A]" />
          <h3 className="font-serif text-xl text-[#173A35] font-semibold">
            Những yếu tố cần cân nhắc & đánh đổi
          </h3>
        </div>
        <div className="space-y-2.5 text-sm text-[#24352F] leading-relaxed">
          {report.tradeOffInsights.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </div>
      </section>

      {/* Phần 5 — Đề xuất bước tiếp theo */}
      <section className="pt-2 space-y-3">
        {consultStatus === 'done' ? (
          <div className="bg-[#173A35]/10 border border-[#173A35]/20 rounded-xl p-4 text-sm text-[#173A35] flex items-center gap-2.5">
            <Compass className="w-5 h-5 shrink-0 text-[#B18A4A]" />
            <span>
              Yêu cầu tư vấn cá nhân hóa cho hồ sơ <strong>{customerCode}</strong> đã được ghi nhận. Chuyên viên RIGHT HOME sẽ liên hệ dựa trên báo cáo nhu cầu này.
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={consultStatus === 'loading'}
            onClick={handleRequestConsult}
            className="w-full bg-[#173A35] hover:bg-[#1e4a44] disabled:opacity-60 text-white py-4 rounded-xl font-semibold text-sm tracking-wider transition cursor-pointer"
          >
            {consultStatus === 'loading' ? 'ĐANG GHI NHẬN...' : 'NHẬN TƯ VẤN CÁ NHÂN HÓA'}
          </button>
        )}

        {consultStatus === 'error' && (
          <p className="text-xs text-red-700 text-center">
            Không thể gửi yêu cầu lúc này, vui lòng thử lại sau.
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowReviewModal(true)}
          className="w-full bg-white hover:bg-white/80 text-[#173A35] border border-[#173A35]/20 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition cursor-pointer"
        >
          XEM LẠI LỰA CHỌN CỦA TÔI
        </button>
      </section>

      {/* Modal xem lại 30 thẻ */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#173A35]/10 flex items-center justify-between">
              <h4 className="font-serif text-xl text-[#173A35] font-semibold">
                Chi tiết lựa chọn của bạn
              </h4>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1 text-[#24352F]/60 hover:text-[#173A35] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 text-sm">
              {swipes.map((item) => {
                const badgeMap = {
                  priority: { label: 'Ưu tiên', cls: 'bg-[#173A35] text-white' },
                  consider: { label: 'Cân nhắc', cls: 'bg-[#B18A4A] text-white' },
                  not_priority: { label: 'Không ưu tiên', cls: 'bg-gray-200 text-gray-700' },
                  undecided: { label: 'Chưa chắc', cls: 'bg-[#F2EBDD] text-[#24352F]' },
                }[item.decision];

                return (
                  <div
                    key={item.cardId}
                    className="flex items-center justify-between gap-3 py-2 border-b border-gray-100"
                  >
                    <span className="text-[#24352F]">{item.title}</span>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 ${badgeMap.cls}`}>
                      {badgeMap.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}