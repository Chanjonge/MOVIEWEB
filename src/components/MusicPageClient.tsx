"use client";

import { useState } from "react";
import { Disc3 } from "lucide-react";
import type { Music } from "@/lib/types";
import { AddMusicForm } from "./AddMusicForm";
import { CdCarousel } from "./CdCarousel";

export function MusicPageClient({ initialItems }: { initialItems: Music[] }) {
  const [items, setItems] = useState(initialItems);

  function handleAdd(music: Music) {
    setItems((prev) => [...prev, music]);
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((m) => m.id !== id));
    fetch(`/api/music/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="relative">
      <div className="spotlight is-violet" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 py-10">
        <div className="text-center">
          <p className="font-marquee flex items-center justify-center gap-2 text-[10px] tracking-[0.25em] text-violet uppercase">
            <span className="h-1 w-1 rounded-full bg-violet shadow-[0_0_5px_2px_rgba(180,140,255,0.7)]" />
            Now Spinning
            <span className="h-1 w-1 rounded-full bg-violet shadow-[0_0_5px_2px_rgba(180,140,255,0.7)]" />
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-wide text-violet sm:text-4xl">
            음악 기록
          </h1>
          <p className="mt-1 text-sm text-muted">
            유튜브 링크를 추가하면 CD가 되어 쌓여요
          </p>
        </div>

        <div className="marquee-lights is-violet mt-8 opacity-80" />

        <div className="mt-10">
          <AddMusicForm onAdd={handleAdd} />
        </div>

        <div className="mt-14">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center text-muted">
              <Disc3 size={36} />
              <p className="font-medium">아직 추가한 음악이 없어요.</p>
              <p className="text-sm">
                위에 유튜브 링크를 붙여넣어 첫 CD를 만들어보세요.
              </p>
            </div>
          ) : (
            <CdCarousel items={items} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
