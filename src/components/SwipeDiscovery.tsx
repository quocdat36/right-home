// src/components/SwipeDiscovery.tsx
'use client';

import { useRef, useState } from 'react';
import { Bookmark, Check, HelpCircle, RotateCcw, X, ArrowRight } from 'lucide-react';
import { CARD_GROUPS, DISCOVERY_CARDS } from '@/data/cards';
import { CardGroupId, SwipeChoiceItem, SwipeDecision } from '@/types/right-home';

interface Props {
  initialSwipes: SwipeChoiceItem[];
  onComplete: (swipes: SwipeChoiceItem[]) => void;
  onBack: () => void;
}

export function SwipeDiscovery({ initialSwipes, onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<SwipeChoiceItem[]>(initialSwipes);
  const [introGroup, setIntroGroup] = useState<CardGroupId | null>('A');

  // Trạng thái kéo thẻ (Pointer Drag)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imgErrorIds, setImgErrorIds] = useState<Record<string, boolean>>({});
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const currentCard = DISCOVERY_CARDS[currentIndex];
  const nextCard = DISCOVERY_CARDS[currentIndex + 1];

  const recordDecision = (decision: SwipeDecision) => {
    if (!currentCard) return;

    const updated = [
      ...choices.filter((c) => c.cardId !== currentCard.id),
      {
        cardId: currentCard.id,
        group: currentCard.group,
        title: currentCard.title,
        decision,
      },
    ];
    setChoices(updated);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    if (currentIndex + 1 >= DISCOVERY_CARDS.length) {
      onComplete(updated);
      return;
    }

    const upcoming = DISCOVERY_CARDS[currentIndex + 1];
    if (upcoming.group !== currentCard.group) {
      setIntroGroup(upcoming.group);
    }
    setCurrentIndex((idx) => idx + 1);
  };

  const handleGoBackCard = () => {
    if (currentIndex === 0) {
      onBack();
      return;
    }
    setIntroGroup(null);
    setCurrentIndex((idx) => idx - 1);
  };

  // Pointer Events cho cảm giác kéo mượt trên mobile & desktop
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !startPosRef.current) return;
    setDragOffset({
      x: e.clientX - startPosRef.current.x,
      y: (e.clientY - startPosRef.current.y) * 0.25,
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    startPosRef.current = null;

    if (dragOffset.x > 95) {
      recordDecision('priority');
    } else if (dragOffset.x < -95) {
      recordDecision('not_priority');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Màn hình chuyển tiếp ngắn giữa các nhóm
  if (introGroup) {
    const groupMeta = CARD_GROUPS[introGroup];
    return (
      <div className="max-w-lg mx-auto px-5 py-12 min-h-[75vh] flex flex-col justify-center">
        <div className="bg-[#173A35] text-[#F2EBDD] rounded-3xl p-8 sm:p-10 shadow-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#B18A4A] font-semibold mb-3">
            {groupMeta.subtitle}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-4">
            {groupMeta.title}
          </h2>
          <p className="text-sm sm:text-base text-[#F2EBDD]/80 leading-relaxed mb-8">
            {groupMeta.description}
          </p>

          <div className="bg-white/10 rounded-xl p-4 mb-8 text-xs sm:text-sm text-[#F2EBDD]/90 space-y-1.5">
            <p>• Vuốt phải (hoặc bấm ✓): <strong>Ưu tiên</strong></p>
            <p>• Vuốt trái (hoặc bấm ✕): <strong>Không ưu tiên</strong></p>
            <p>• Biểu tượng Bookmark: <strong>Cân nhắc thêm</strong> · Nút <strong>Chưa chắc</strong> để bỏ qua</p>
          </div>

          <button
            type="button"
            onClick={() => setIntroGroup(null)}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#B18A4A] hover:bg-[#c39a56] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition cursor-pointer"
          >
            <span>TIẾP TỤC KHÁM PHÁ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  const rotation = dragOffset.x * 0.04;
  const swipeHint =
    dragOffset.x > 40 ? 'ƯU TIÊN' : dragOffset.x < -40 ? 'KHÔNG ƯU TIÊN' : null;

  return (
    <div className="max-w-md mx-auto px-5 py-6 flex flex-col items-center">
      {/* Thanh thông tin nhóm + tiến độ X/30 */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleGoBackCard}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#24352F]/70 hover:text-[#173A35] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Thẻ trước
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider text-[#B18A4A]">
          Nhóm {currentCard.group} · {currentCard.groupTitle}
        </span>

        <span className="text-xs font-semibold text-[#173A35] bg-white px-2.5 py-1 rounded-full border border-[#173A35]/10">
          {currentIndex + 1}/{DISCOVERY_CARDS.length}
        </span>
      </div>

      {/* Khu vực Stack Card */}
      <div className="relative w-full h-[420px] sm:h-[450px] mb-6 select-none">
        {/* Thẻ kế tiếp phía sau */}
        {nextCard && (
          <div className="absolute inset-0 bg-white rounded-3xl border border-[#173A35]/10 scale-[0.96] translate-y-3 opacity-60 pointer-events-none" />
        )}

        {/* Thẻ chính đang thao tác */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
            touchAction: 'pan-y',
          }}
          className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-[#173A35]/10 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
        >
          {/* Phần hình ảnh + Fallback kiến trúc thanh lịch */}
          <div className="relative h-[58%] bg-[#173A35] overflow-hidden">
            {!imgErrorIds[currentCard.id] ? (
              <img
                src={currentCard.imagePath}
                alt={currentCard.title}
                draggable={false}
                onError={() =>
                  setImgErrorIds((prev) => ({ ...prev, [currentCard.id]: true }))
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#173A35] via-[#1e4b44] to-[#0f2925] flex flex-col items-center justify-center p-6 text-center">
                <span className="font-serif text-4xl text-[#B18A4A]/40 tracking-widest mb-2">
                  {currentCard.id}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#F2EBDD]/60">
                  {currentCard.categoryTag}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <span className="absolute top-4 left-4 bg-[#F2EBDD]/95 text-[#173A35] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
              {currentCard.categoryTag}
            </span>

            {/* Nhãn phản hồi khi đang vuốt */}
            {swipeHint && (
              <div
                className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-widest border-2 ${
                  swipeHint === 'ƯU TIÊN'
                    ? 'bg-[#173A35]/90 text-white border-[#B18A4A]'
                    : 'bg-white/90 text-[#24352F] border-[#24352F]/40'
                }`}
              >
                {swipeHint}
              </div>
            )}
          </div>

          {/* Nội dung thẻ */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-[26px] text-[#173A35] font-semibold leading-snug mb-2">
              {currentCard.title}
            </h3>
            <p className="text-sm text-[#24352F]/80 leading-relaxed">
              {currentCard.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bộ nút điều khiển thay thế cho thao tác vuốt */}
      <div className="w-full flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Không ưu tiên"
          onClick={() => recordDecision('not_priority')}
          className="w-14 h-14 rounded-full bg-white border border-[#173A35]/20 text-[#24352F] hover:border-red-400 hover:text-red-600 flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => recordDecision('undecided')}
          className="px-4 h-11 rounded-full bg-white border border-[#173A35]/15 text-xs font-medium text-[#24352F]/75 hover:text-[#173A35] inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          Chưa chắc
        </button>

        <button
          type="button"
          aria-label="Cân nhắc thêm"
          onClick={() => recordDecision('consider')}
          className="w-12 h-12 rounded-full bg-white border border-[#B18A4A]/50 text-[#B18A4A] hover:bg-[#B18A4A] hover:text-white flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Ưu tiên"
          onClick={() => recordDecision('priority')}
          className="w-14 h-14 rounded-full bg-[#173A35] text-white hover:bg-[#1e4a44] flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-3 flex justify-between w-full max-w-[270px] text-[11px] text-[#24352F]/55">
        <span>Không ưu tiên</span>
        <span>Cân nhắc</span>
        <span>Ưu tiên</span>
      </div>
    </div>
  );
}