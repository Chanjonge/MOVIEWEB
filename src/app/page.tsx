import Link from "next/link";
import { Clapperboard, Disc3 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="spotlight" aria-hidden />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 py-16 text-center sm:py-24">
        <p className="font-marquee flex items-center gap-2 text-[11px] tracking-[0.3em] text-gold uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(255,201,77,0.7)]" />
          My Archive
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(255,201,77,0.7)]" />
        </p>
        <h1
          className="neon-text mt-4 font-display text-4xl tracking-wide text-gold sm:text-5xl"
          style={{ "--glow-color": "rgba(255,201,77,0.45)" } as React.CSSProperties}
        >
          보고 들은 것들을 기록하는 곳
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted sm:text-base">
          영화는 티켓 한 장으로, 음악은 CD 한 장으로. 기록할 항목을 골라주세요.
        </p>

        <div className="mt-14 grid w-full gap-7 sm:grid-cols-2">
          <Link
            href="/movies"
            className="foil-border group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl px-8 pb-10 pt-6 shadow-xl shadow-black/40 transition hover:-translate-y-1"
          >
            <div className="marquee-lights is-animated -mx-8 -mt-6 mb-2 w-[calc(100%+4rem)]" />
            <span className="pointer-events-none absolute -right-8 -top-2 text-[9rem] leading-none text-gold/5 transition group-hover:text-gold/10">
              🎬
            </span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30 transition group-hover:shadow-[0_0_24px_4px_rgba(255,201,77,0.35)]">
              <Clapperboard size={30} />
            </span>
            <span className="font-display text-2xl tracking-wide text-gold">
              영화
            </span>
            <span className="text-sm text-muted">
              티켓 모양으로 기록하는 나의 영화 목록
            </span>
          </Link>

          <Link
            href="/music"
            className="foil-border is-violet group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl px-8 pb-10 pt-6 shadow-xl shadow-black/40 transition hover:-translate-y-1"
          >
            <div className="marquee-lights is-animated is-violet -mx-8 -mt-6 mb-2 w-[calc(100%+4rem)]" />
            <span className="pointer-events-none absolute -right-8 -top-2 text-[9rem] leading-none text-violet/5 transition group-hover:text-violet/10">
              💿
            </span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet ring-1 ring-violet/30 transition group-hover:shadow-[0_0_24px_4px_rgba(180,140,255,0.35)]">
              <Disc3 size={30} />
            </span>
            <span className="font-display text-2xl tracking-wide text-violet">
              음악
            </span>
            <span className="text-sm text-muted">
              CD 모양으로 돌아가는 나의 플레이리스트
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
