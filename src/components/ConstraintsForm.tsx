// src/components/ConstraintsForm.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PracticalConstraintsData } from '@/types/right-home';

interface Props {
  initialData: PracticalConstraintsData;
  onSubmit: (data: PracticalConstraintsData) => void;
  onBack: () => void;
}

const BUDGETS = ['Dưới 2 tỷ', '2–3 tỷ', '3–4 tỷ', '4–5 tỷ', '5–7 tỷ', 'Trên 7 tỷ', 'Chưa xác định'];
const BEDROOMS = ['1 phòng ngủ', '2 phòng ngủ', '3 phòng ngủ', '4 phòng ngủ trở lên', 'Chưa xác định'];
const DISTRICTS = ['Hà Nội', 'Khu Đông', 'Khu Tây', 'Khu Nam', 'Khu Bắc', 'Khu vực khác'];
const TIMELINES = ['Trong 3 tháng', '3–6 tháng', '6–12 tháng', 'Trên 12 tháng', 'Chưa xác định'];
const FINANCIAL_OPTS = [
  'Có sẵn phần lớn ngân sách',
  'Có một phần vốn tự có, cần vay ngân hàng',
  'Cần phương án thanh toán theo tiến độ',
  'Đang tìm hiểu khả năng tài chính',
];
const EQUITY_RATIOS = ['Dưới 20%', '20–30%', '30–50%', 'Trên 50%', 'Chưa xác định'];
const TRADEOFF_OPTS = [
  'Xa trung tâm hơn để có giá tốt',
  'Diện tích nhỏ hơn để giảm ngân sách',
  'Ít tiện ích hơn để giảm chi phí',
  'Chấp nhận thời gian di chuyển dài hơn',
  'Không muốn đánh đổi các tiêu chí đã chọn',
];

export function ConstraintsForm({ initialData, onSubmit, onBack }: Props) {
  const [form, setForm] = useState<PracticalConstraintsData>(initialData);
  const [error, setError] = useState('');

  const toggleTradeOff = (option: string) => {
    setError('');
    if (option === 'Không muốn đánh đổi các tiêu chí đã chọn') {
      setForm((prev) => ({
        ...prev,
        tradeOffs: prev.tradeOffs.includes(option) ? [] : [option],
      }));
      return;
    }
    setForm((prev) => {
      const cleaned = prev.tradeOffs.filter(
        (t) => t !== 'Không muốn đánh đổi các tiêu chí đã chọn'
      );
      return {
        ...prev,
        tradeOffs: cleaned.includes(option)
          ? cleaned.filter((t) => t !== option)
          : [...cleaned, option],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.budgetRange ||
      !form.bedrooms ||
      !form.preferredDistrict ||
      !form.purchaseTimeline ||
      !form.financialCapacity
    ) {
      setError('Vui lòng hoàn thành các lựa chọn ngân sách, phòng ngủ, khu vực, thời gian và tài chính.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-5 py-8 sm:py-10 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#B18A4A] font-semibold mb-2">
          Ràng buộc thực tế
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#173A35] font-semibold leading-tight">
          Một căn nhà phù hợp cũng cần nằm trong khả năng thực tế.
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#173A35]/10 space-y-7">
        {/* Ngân sách */}
        <div>
          <label className="block text-sm font-semibold text-[#173A35] mb-2.5">Ngân sách dự kiến *</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {BUDGETS.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setForm({ ...form, budgetRange: b })}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${
                  form.budgetRange === b
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-white text-[#24352F] border-[#173A35]/20'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <input
            type="number"
            step="0.1"
            min="0.5"
            value={form.customMaxBudget}
            onChange={(e) => setForm({ ...form, customMaxBudget: e.target.value })}
            placeholder="Hoặc nhập mức ngân sách tối đa cụ thể (tỷ VNĐ, không bắt buộc)"
            className="w-full px-4 py-2.5 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/20 text-sm focus:outline-none focus:border-[#173A35]"
          />
        </div>

        {/* Số phòng ngủ */}
        <div>
          <label className="block text-sm font-semibold text-[#173A35] mb-2.5">Số phòng ngủ *</label>
          <div className="flex flex-wrap gap-2">
            {BEDROOMS.map((room) => (
              <button
                type="button"
                key={room}
                onClick={() => setForm({ ...form, bedrooms: room })}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${
                  form.bedrooms === room
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-white text-[#24352F] border-[#173A35]/20'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* Khu vực & Nơi làm việc */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#173A35]">Khu vực ưu tiên *</label>
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setForm({ ...form, preferredDistrict: d })}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${
                  form.preferredDistrict === d
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-white text-[#24352F] border-[#173A35]/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.workplaceLocation}
            onChange={(e) => setForm({ ...form, workplaceLocation: e.target.value })}
            placeholder="Khu vực làm việc hoặc địa điểm thường xuyên di chuyển tới (VD: Cầu Giấy, Quận 1...)"
            className="w-full px-4 py-2.5 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/20 text-sm focus:outline-none focus:border-[#173A35]"
          />
        </div>

        {/* Thời gian dự kiến mua */}
        <div>
          <label className="block text-sm font-semibold text-[#173A35] mb-2.5">Thời gian dự kiến mua *</label>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, purchaseTimeline: t })}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${
                  form.purchaseTimeline === t
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-white text-[#24352F] border-[#173A35]/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Khả năng tài chính */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#173A35]">Khả năng tài chính *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FINANCIAL_OPTS.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setForm({ ...form, financialCapacity: f })}
                className={`px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm border transition cursor-pointer ${
                  form.financialCapacity === f
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-white text-[#24352F] border-[#173A35]/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-xs text-[#24352F]/70 mb-2">
              Tỷ lệ vốn tự có ước tính (không bắt buộc):
            </p>
            <div className="flex flex-wrap gap-2">
              {EQUITY_RATIOS.map((eq) => (
                <button
                  type="button"
                  key={eq}
                  onClick={() =>
                    setForm({ ...form, equityRatio: form.equityRatio === eq ? '' : eq })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer ${
                    form.equityRatio === eq
                      ? 'bg-[#B18A4A] text-white border-[#B18A4A]'
                      : 'bg-white text-[#24352F] border-[#173A35]/20'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mức độ linh hoạt / Đánh đổi */}
        <div>
          <label className="block text-sm font-semibold text-[#173A35] mb-2.5">
            Bạn sẵn sàng đánh đổi điều gì để có một căn nhà phù hợp hơn?
          </label>
          <div className="space-y-2">
            {TRADEOFF_OPTS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => toggleTradeOff(opt)}
                className={`w-full px-4 py-3 rounded-xl text-left text-xs sm:text-sm border transition cursor-pointer ${
                  form.tradeOffs.includes(opt)
                    ? 'bg-[#173A35] text-white border-[#173A35]'
                    : 'bg-[#F2EBDD]/25 text-[#24352F] border-[#173A35]/15'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#24352F]/70 hover:text-[#173A35] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#B18A4A] hover:bg-[#c39a56] text-white px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide shadow-sm transition cursor-pointer"
          >
            <span>PHÂN TÍCH NHU CẦU</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}