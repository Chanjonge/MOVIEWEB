import { NextRequest, NextResponse } from "next/server";
import { deleteMovie, getMovie, updateMovie } from "@/lib/movies";
import { deleteUploadedImage, saveUploadedImage } from "@/lib/upload";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const movie = await getMovie(id);
  if (!movie) {
    return NextResponse.json({ error: "존재하지 않는 기록이에요." }, { status: 404 });
  }
  return NextResponse.json(movie);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getMovie(id);
  if (!existing) {
    return NextResponse.json({ error: "존재하지 않는 기록이에요." }, { status: 404 });
  }

  const form = await req.formData();
  const title = form.get("title");
  const rating = form.get("rating");
  const review = form.get("review");
  const file = form.get("thumbnail");

  const patch: {
    title?: string;
    rating?: number;
    review?: string;
    thumbnail?: string | null;
  } = {};

  if (title !== null) {
    const trimmed = String(title).trim();
    if (!trimmed) {
      return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    }
    patch.title = trimmed;
  }
  if (rating !== null) {
    const num = Number(rating);
    patch.rating = Number.isFinite(num) ? Math.min(5, Math.max(0, num)) : 0;
  }
  if (review !== null) patch.review = String(review);

  if (file instanceof File && file.size > 0) {
    const result = await saveUploadedImage(file);
    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }
    patch.thumbnail = result.url;
    await deleteUploadedImage(existing.thumbnail);
  } else if (form.get("removeThumbnail") === "true") {
    patch.thumbnail = null;
    await deleteUploadedImage(existing.thumbnail);
  }

  const updated = await updateMovie(id, patch);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getMovie(id);
  if (!existing) {
    return NextResponse.json({ error: "존재하지 않는 기록이에요." }, { status: 404 });
  }
  await deleteMovie(id);
  await deleteUploadedImage(existing.thumbnail);
  return NextResponse.json({ success: true });
}
