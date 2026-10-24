"use client";

import clsx from "clsx";
import type { Music } from "@/lib/types";

interface CdDiscProps {
  item: Music;
  spinning: boolean;
  onClick: () => void;
}

export function CdDisc({ item, spinning, onClick }: CdDiscProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full cursor-pointer outline-none"
      aria-label={spinning ? `일시정지: ${item.title}` : `재생: ${item.title}`}
    >
      <span
        className={clsx(
          "cd-disc block aspect-square w-full bg-surface-2",
          spinning && "cd-spin is-active"
        )}
        style={{ backgroundImage: `url(${item.thumbnail})` }}
      />
    </button>
  );
}
