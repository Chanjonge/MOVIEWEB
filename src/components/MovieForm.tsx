"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Movie } from "@/lib/types";

const MAX_SIZE = 5 * 1024 * 1024;

interface MovieFormProps {
  mode: "create" | "edit";
  initial?: Movie;
}

export function MovieForm({ mode, initial }: MovieFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [review, setReview] = useState(initial?.review ?? "");
  const [preview, setPreview] = useState<string | null>(initial?.thumbnail ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("이미지 파일만 첨부할 수 있어요.");
      e.target.value = "";
      return;
    }
    if (f.size >= MAX_SIZE) {
      setError("파일 크기는 5MB 미만이어야 해요.");
      e.target.value = "";
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleRemoveImage() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("영화 제목을 입력해주세요.");
      return;
    }
    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("rating", String(rating));
    formData.set("review", review);
    if (file) {
      formData.set("thumbnail", file);
    } else if (mode === "edit" && preview === null && initial?.thumbnail) {
      formData.set("removeThumbnail", "true");
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/movies" : `/api/movies/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        setSaving(false);
        return;
      }
      if (mode === "create") {
        router.push(`/movies/${data.id}`);
      } else {
        setSaving(false);
        router.refresh();
      }
    } catch {
      setError("저장 중 문제가 발생했어요.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial) return;
    if (!window.confirm("이 기록을 삭제할까요? 되돌릴 수 없어요.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/movies/${initial.id}`, { method: "DELETE" });
      router.push("/movies");
      router.refresh();
    } catch {
      setError("삭제 중 문제가 발생했어요.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-5 py-10">
      <div className="paper-lines paper-pin relative rounded-3xl bg-paper px-6 py-8 text-paper-ink shadow-2xl shadow-black/40 sm:px-10 sm:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full bg-transparent font-display text-3xl tracking-wide placeholder:text-paper-ink/30 focus:outline-none sm:text-4xl"
          />
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-red-700/70 transition hover:bg-red-700/10 disabled:opacity-50"
            >
              <Trash2 size={14} />
              삭제
            </button>
          )}
        </div>

        <StarRating value={rating} onChange={setRating} colorClassName="text-gold-dark" />

        <div className="mt-6">
          <input
            ref={fileInputRef}
            id="movie-thumbnail-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <div className="relative w-40 overflow-hidden rounded-xl ring-1 ring-black/10 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="영화 썸네일"
                className="aspect-[2/3] w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="이미지 제거"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-xs font-medium text-white transition hover:bg-black/75"
              >
                이미지 변경
              </button>
            </div>
          ) : (
            <label
              htmlFor="movie-thumbnail-input"
              className="flex w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-paper-ink/25 py-10 text-center text-paper-ink/60 transition hover:border-paper-ink/45 hover:text-paper-ink/80 sm:w-48"
            >
              <ImagePlus size={24} />
              <span className="text-sm font-medium">썸네일 첨부</span>
              <span className="px-2 text-xs">5MB 미만의 이미지</span>
            </label>
          )}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="영화에 대한 후기를 자유롭게 남겨보세요."
          rows={8}
          className="mt-8 w-full resize-none bg-transparent leading-[1.85rem] placeholder:text-paper-ink/30 focus:outline-none"
        />

        {error && (
          <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-paper-ink px-6 py-2.5 text-sm font-bold text-paper shadow-lg shadow-black/30 transition hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            저장하기
          </button>
        </div>
      </div>
    </form>
  );
}
