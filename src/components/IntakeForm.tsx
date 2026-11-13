// src/components/IntakeForm.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CustomerIntakeData } from '@/types/right-home';
import { phoneRegex } from '@/lib/validation';

interface Props {
  initialData: CustomerIntakeData;
  onComplete: (data: CustomerIntakeData) => void;
  onBackToLanding: () => void;
}

const AREA_OPTIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Khu Đông', 'Khu Tây', 'Khu Nam', 'Khu Bắc'];
const AGE_OPTIONS = ['Dưới 25 tuổi', '25–30 tuổi', '31–35 tuổi', '36–45 tuổi', 'Trên 45 tuổi'];
const FAMILY_OPTIONS = [
  'Độc thân',
  'Vợ chồng trẻ chưa có con',
  'Gia đình có con nhỏ',
  'Gia đình nhiều thế hệ',
];
const INTENT_OPTIONS = [
  'Mua nhà để ở.',
  'Mua nhà kết hợp đầu tư dài hạn.',
  'Đang tìm hiểu, chưa có kế hoạch cụ thể.',
];

export function IntakeForm({ initialData, onComplete, onBackToLanding }: Props) {
  const [subStep, setSubStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<CustomerIntakeData>(initialData);
  const [error, setError] = useState<string>('');

  const update = <K extends keyof CustomerIntakeData>(key: K, value: CustomerIntakeData[K]) => {
    setError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNextStep = () => {
    if (subStep === 1) {
      if (form.fullName.trim().length < 2) {
        return setError('Vui lòng nhập họ và tên của bạn.');
      }
      const cleanPhone = form.phone.replace(/[\s.-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return setError('Vui lòng nhập số điện thoại di động Việt Nam hợp lệ (VD: 0912345678).');
      }
      if (!form.targetArea.trim()) {
        return setError('Vui lòng chọn hoặc nhập khu vực bạn muốn mua nhà.');
      }
      setSubStep(2);
      return;
    }

    if (subStep === 2) {
      if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return setError('Địa chỉ email chưa đúng định dạng.');
      }
      setSubStep(3);
      return;
    }

    if (subStep === 3) {
      if (!form.initialIntent) {
        return setError('Vui lòng chọn nhu cầu ban đầu của bạn.');
      }
      if (!form.privacyConsent) {
        return setError('Bạn cần xác nhận đồng ý lưu trữ thông tin để nhận báo cáo cá nhân hóa.');
      }
      onComplete({
        ...form,
        phone: form.phone.replace(/[\s.-]/g, ''),
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B18A4A] font-semibold mb-2">
          Phần {subStep}/3 · Hồ sơ ban đầu
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#173A35] font-semibold leading-tight">
          Trước tiên, hãy để chúng tôi hiểu bạn.
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#173A35]/10">
        {subStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-1.5">
                Họ và tên <span className="text-[#B18A4A]">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="VD: Nguyễn Minh Anh"
                className="w-full px-4 py-3 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/25 focus:outline-none focus:border-[#173A35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-1.5">
                Số điện thoại <span className="text-[#B18A4A]">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full px-4 py-3 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/25 focus:outline-none focus:border-[#173A35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-2">
                Khu vực muốn mua nhà <span className="text-[#B18A4A]">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {AREA_OPTIONS.map((area) => (
                  <button
                    type="button"
                    key={area}
                    onClick={() => update('targetArea', area)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition cursor-pointer ${
                      form.targetArea === area
                        ? 'bg-[#173A35] text-white border-[#173A35]'
                        : 'bg-white text-[#24352F] border-[#173A35]/20 hover:border-[#173A35]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.targetArea}
                onChange={(e) => update('targetArea', e.target.value)}
                placeholder="Hoặc nhập quận/khu vực cụ thể..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/25 text-sm focus:outline-none focus:border-[#173A35]"
              />
            </div>
          </div>
        )}

        {subStep === 2 && (
          <div className="space-y-5">
            <p className="text-sm text-[#24352F]/70">
              Các thông tin dưới đây là <strong>không bắt buộc</strong>, giúp báo cáo phản ánh sát hơn giai đoạn sống của bạn.
            </p>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/25 focus:outline-none focus:border-[#173A35]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-2">Nhóm tuổi</label>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((age) => (
                  <button
                    type="button"
                    key={age}
                    onClick={() => update('ageGroup', form.ageGroup === age ? '' : age)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${
                      form.ageGroup === age
                        ? 'bg-[#173A35] text-white border-[#173A35]'
                        : 'bg-white text-[#24352F] border-[#173A35]/20'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-1.5">Nghề nghiệp</label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => update('occupation', e.target.value)}
                placeholder="VD: Kỹ sư phần mềm, Tài chính, Kiến trúc sư..."
                className="w-full px-4 py-3 rounded-xl border border-[#173A35]/20 bg-[#F2EBDD]/25 focus:outline-none focus:border-[#173A35]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-2">
                Tình trạng gia đình
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FAMILY_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => update('familyStatus', form.familyStatus === opt ? '' : opt)}
                    className={`px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm border transition cursor-pointer ${
                      form.familyStatus === opt
                        ? 'bg-[#173A35] text-white border-[#173A35]'
                        : 'bg-white text-[#24352F] border-[#173A35]/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {subStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#24352F] mb-3">
                Nhu cầu ban đầu của bạn là gì? <span className="text-[#B18A4A]">*</span>
              </label>
              <div className="space-y-2.5">
                {INTENT_OPTIONS.map((intent) => (
                  <button
                    type="button"
                    key={intent}
                    onClick={() => update('initialIntent', intent)}
                    className={`w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium border flex items-center justify-between transition cursor-pointer ${
                      form.initialIntent === intent
                        ? 'bg-[#173A35] text-white border-[#173A35]'
                        : 'bg-[#F2EBDD]/30 text-[#24352F] border-[#173A35]/20 hover:border-[#173A35]'
                    }`}
                  >
                    <span>{intent}</span>
                    {form.initialIntent === intent && <Check className="w-4 h-4 text-[#B18A4A]" />}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.privacyConsent}
                onChange={(e) => update('privacyConsent', e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#173A35] rounded cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[#24352F]/80 leading-relaxed">
                Tôi đồng ý cho <strong>RIGHT HOME</strong> lưu trữ và sử dụng thông tin cá nhân trên để phân tích nhu cầu và tư vấn phù hợp theo chính sách quyền riêng tư.
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (subStep === 1 ? onBackToLanding() : setSubStep((s) => (s - 1) as 1 | 2))}
            className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#24352F]/70 hover:text-[#173A35] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-2 bg-[#173A35] hover:bg-[#1f4c45] text-white px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition cursor-pointer"
          >
            <span>{subStep === 3 ? 'KHÁM PHÁ NHU CẦU CỦA TÔI' : 'TIẾP TỤC'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}