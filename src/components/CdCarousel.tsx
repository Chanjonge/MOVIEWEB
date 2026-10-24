"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import type { Music } from "@/lib/types";
import { useYoutubeAudioPlayer } from "@/hooks/useYoutubeAudioPlayer";
import { CdDisc } from "./CdDisc";

function circularOffset(index: number, current: number, len: number) {
  let diff = index - current;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

function slotStyle(offset: number): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: "min(48vw, 260px)",
    transition:
      "left 500ms ease, top 500ms ease, transform 500ms ease, opacity 500ms ease",
  };
  if (offset === 0) {
    return {
      ...base,
      left: "50%",
      top: 0,
      transform: "translateX(-50%) scale(1)",
      opacity: 1,
      zIndex: 3,
    };
  }
  if (offset === -1) {
    return {
      ...base,
      left: "0%",
      top: 64,
      transform: "translateX(-50%) scale(0.68)",
      opacity: 0.5,
      zIndex: 2,
    };
  }
  if (offset === 1) {
    return {
      ...base,
      left: "100%",
      top: 64,
      transform: "translateX(-50%) scale(0.68)",
      opacity: 0.5,
      zIndex: 2,
    };
  }
  const parkLeft = offset < 0;
  return {
    ...base,
    left: parkLeft ? "0%" : "100%",
    top: 64,
    transform: "translateX(-50%) scale(0.5)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none",
  };
}

interface CdCarouselProps {
  items: Music[];
  onDelete: (id: string) => void;
}

export function CdCarousel({ items, onDelete }: CdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);
  const safeIndex =
    items.length === 0 ? 0 : Math.min(currentIndex, items.length - 1);

  // The YT player is created once and calls onEnded from its own event
  // callback (an external system, not React state), so the "advance to next
  // track" logic needs to run there too. It depends on `play`, which is only
  // available after calling the hook below - so it's stored in a ref and
  // filled in every render, letting a stable wrapper forward to it.
  const handleEndedRef = useRef<() => void>(() => {});
  const { wrapperRef, isPlaying, play, pause, resume } = useYoutubeAudioPlayer(
    () => handleEndedRef.current()
  );

  useEffect(() => {
    handleEndedRef.current = () => {
      if (items.length === 0) return;
      if (items.length === 1) {
        play(items[0].videoId);
        return;
      }
      setCurrentIndex((i) => {
        const base = Math.min(i, items.length - 1);
        const nextIndex = (base + 1) % items.length;
        const nextItem = items[nextIndex];
        if (nextItem) {
          play(nextItem.videoId);
          setLoadedItemId(nextItem.id);
        }
        return nextIndex;
      });
    };
  });

  const currentItem = items[safeIndex];
  const currentIsLoaded = !!currentItem && loadedItemId === currentItem.id;

  function ensurePlayingCurrent() {
    if (!currentItem) return;
    if (loadedItemId !== currentItem.id) {
      play(currentItem.videoId);
      setLoadedItemId(currentItem.id);
    } else if (!isPlaying) {
      resume();
    }
  }

  function handleTogglePlay() {
    if (!currentItem) return;
    if (currentIsLoaded && isPlaying) {
      pause();
    } else {
      ensurePlayingCurrent();
    }
  }

  function goTo(index: number) {
    const wasPlaying = isPlaying;
    setCurrentIndex(index);
    if (wasPlaying) {
      const nextItem = items[index];
      if (nextItem) {
        play(nextItem.videoId);
        setLoadedItemId(nextItem.id);
      }
    }
  }

  function handlePrev() {
    if (items.length < 2) return;
    goTo((safeIndex - 1 + items.length) % items.length);
  }

  function handleNext() {
    if (items.length < 2) return;
    goTo((safeIndex + 1) % items.length);
  }

  function handleDelete(id: string) {
    if (!window.confirm("이 음악을 삭제할까요?")) return;
    if (loadedItemId === id) {
      pause();
      setLoadedItemId(null);
    }
    onDelete(id);
  }

  if (!currentItem) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={wrapperRef}
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 h-px w-px overflow-hidden opacity-0"
      />

      <div className="relative w-full max-w-xl">
        <button
          type="button"
          onClick={handlePrev}
          disabled={items.length < 2}
          aria-label="이전 곡"
          className="absolute left-0 top-[100px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-foreground ring-1 ring-border backdrop-blur transition hover:ring-violet/60 hover:text-violet disabled:opacity-30 sm:top-[120px]"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={items.length < 2}
          aria-label="다음 곡"
          className="absolute right-0 top-[100px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-foreground ring-1 ring-border backdrop-blur transition hover:ring-violet/60 hover:text-violet disabled:opacity-30 sm:top-[120px]"
        >
          <ChevronRight size={20} />
        </button>

        <div className="relative h-[260px] w-full overflow-hidden sm:h-[300px]">
          {items.map((item, idx) => {
            const offset = circularOffset(idx, safeIndex, items.length);
            if (Math.abs(offset) > 2) return null;
            const isCenter = offset === 0;
            const spinning = isCenter && loadedItemId === item.id && isPlaying;
            return (
              <div key={item.id} style={slotStyle(offset)}>
                <CdDisc
                  item={item}
                  spinning={spinning}
                  onClick={() => (isCenter ? handleTogglePlay() : goTo(idx))}
                />
                {isCenter && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label="삭제"
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted ring-1 ring-border transition hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleTogglePlay}
        className="flex items-center gap-2 rounded-full bg-violet px-6 py-2.5 text-sm font-bold text-background shadow-[0_0_24px_rgba(180,140,255,0.4)] transition hover:opacity-90"
      >
        {currentIsLoaded && isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" />
        )}
        {currentIsLoaded && isPlaying ? "일시정지" : "재생"}
      </button>

      <div className="text-center">
        <p className="max-w-xs truncate font-display text-lg tracking-wide text-foreground sm:max-w-sm sm:text-xl">
          {currentItem.title}
        </p>
        <p className="font-marquee mt-1.5 text-xs tracking-widest text-muted">
          {safeIndex + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
