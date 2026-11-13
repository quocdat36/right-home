// src/components/LandingScreen.tsx
'use client';

import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function LandingScreen({ onStart }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-[#173A35] text-[#F2EBDD] overflow-hidden">
      {/* Ảnh nền kiến trúc + Lớp phủ tối nhẹ (fallback tinh tế nếu chưa đặt file ảnh) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 scale-105"
        style={{ backgroundImage: "url('/images/hero-architecture.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#173A35]/80 via-[#173A35]/75 to-[#112B27]" />

      {/* Header tối giản */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 pt-8 flex items-center justify-between">
        <span className="font-serif text-xl sm:text-2xl tracking-[0.22em] font-semibold text-[#FFFFFF]">
          RIGHT HOME
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#B18A4A] font-medium">
          Smart Home Discovery
        </span>
      </div>

      {/* Nội dung trung tâm */}
      <div className="relative z-10 max-w-3xl w-full mx-auto px-6 py-14 my-auto">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#B18A4A] font-medium mb-5">
          Chọn nhà có công thức.
        </p>

        <h1 className="font-serif text-3xl sm:text-5xl leading-[1.2] font-medium text-[#FFFFFF] mb-6">
          Một căn nhà phù hợp không bắt đầu từ việc xem thật nhiều dự án. Nó bắt đầu từ việc hiểu rõ bạn thực sự cần gì.
        </h1>

        <p className="text-base sm:text-lg text-[#F2EBDD]/85 leading-relaxed max-w-xl mb-10 font-light">
          Khám phá nhu cầu sống, xác định ưu tiên và tìm ra những lựa chọn nhà ở phù hợp với khả năng tài chính của bạn.
        </p>

        <div className="flex flex-col items-start gap-4">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 bg-[#B18A4A] hover:bg-[#c39a56] active:scale-[0.99] text-[#FFFFFF] px-8 py-4 rounded-xl text-sm sm:text-base font-semibold tracking-wider transition-all duration-300 shadow-lg shadow-black/20 cursor-pointer"
          >
            <span>BẮT ĐẦU KHÁM PHÁ</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-xs sm:text-sm text-[#F2EBDD]/65 tracking-wide">
            Khoảng 3–5 phút · Miễn phí · Không cần đăng nhập
          </p>
        </div>
      </div>

      {/* Footer đường kẻ kiến trúc */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 pb-8 border-t border-[#F2EBDD]/10 pt-5 flex flex-wrap justify-between gap-2 text-xs text-[#F2EBDD]/50">
        <span>Phương pháp phân tích ưu tiên không gian sống & tài chính</span>
        <span>Không quảng cáo · Không làm phiền</span>
      </div>
    </section>
  );
}