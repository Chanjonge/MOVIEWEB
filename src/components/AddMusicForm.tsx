"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import type { Music } from "@/lib/types";

export function AddMusicForm({ onAdd }: { onAdd: (music: Music) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "추가에 실패했어요.");
        return;
      }
      onAdd(data as Music);
      setUrl("");
    } catch {
      setError("추가 중 문제가 발생했어요. 네트워크를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">-
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="유튜브 영상 링크를 붙여넣으세요"
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm placeholder:text-muted/60 focus:border-violet focus:shadow-[0_0_0_3px_rgba(180,140,255,0.2)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-1.5 rounded-full bg-violet px-5 py-2.5 text-sm font-bold text-background shadow-[0_0_20px_rgba(180,140,255,0.35)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Plus size={15} />
          )}
          추가
        </button>
      </form>
      {error && (
        <p className="mt-2 text-center text-sm font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
